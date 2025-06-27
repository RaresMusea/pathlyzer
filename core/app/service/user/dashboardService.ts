import { dayLabels } from "@/lib/TimeUtils";
import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { UserLearningCompletionDto, WeeklyActivityEntry } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUserCompletions = cache(async (): Promise<UserLearningCompletionDto> => {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const completedCourses: number = await db.enrollment.count({
        where: {
            userId,
            completed: true,
        },
    });

    const completedUnits: number = await db.unitProgress.count({
        where: {
            userId,
            completed: true,
        },
    });

    const completedLessons: number = await db.lessonProgress.count({
        where: {
            userId,
            completed: true,
        },
    });

    const completedLessonQuizzes: number = await db.lessonProgress.count({
        where: {
            userId,
            completed: true,
            lesson: {
                NOT: {
                    Quiz: null,
                },
            },
        },
    });

    const completedUnitExams: number = await db.unitProgress.count({
        where: {
            userId,
            completed: true,
            unit: {
                NOT: {
                    exam: null,
                },
            },
        },
    });

    const completedEvaluations = completedLessonQuizzes + completedUnitExams;

    return {
        completedCourses,
        completedUnits,
        completedLessons,
        completedEvaluations,
    };
});

export const getWeeklyLearningActivity = async (): Promise<WeeklyActivityEntry[]> => {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();
    if (!userId) return [];

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    const daysMap: Record<string, WeeklyActivityEntry> = {};

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const label = dayLabels[d.getDay()];
        daysMap[label] = { day: label, sessions: 0, duration: 0, xpGained: 0, lessonsCompleted: 0 };
    }

    const sessions = await db.learningSession.findMany({
        where: { userId, startedAt: { gte: startOfWeek }, endedAt: { not: null } },
        select: { startedAt: true, duration: true }
    });

    for (const session of sessions) {
        const date = new Date(session.startedAt);
        const label = dayLabels[date.getDay()];
        daysMap[label].sessions += 1;
        daysMap[label].duration += session.duration ?? 0;
    }

    const lessonProgress = await db.lessonProgress.findMany({
        where: {
            userId,
            completed: true,
            accessedAt: { gte: startOfWeek }
        },
        select: {
            accessedAt: true,
            lesson: {
                select: {
                    Quiz: {
                        where: { type: "LESSON_QUIZ" },
                        select: {
                            questions: { select: { rewardXp: true } }
                        }
                    }
                }
            }
        }
    });

    for (const progress of lessonProgress) {
        const date = new Date(progress.accessedAt);
        const label = dayLabels[date.getDay()];
        const xp = progress.lesson?.Quiz?.questions.reduce((sum, q) => sum + q.rewardXp, 0) ?? 0;

        daysMap[label].lessonsCompleted += 1;
        daysMap[label].xpGained += xp;
    }

    const ordered = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return ordered.map(label => daysMap[label]);
};
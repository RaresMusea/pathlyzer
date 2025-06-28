import { dayLabels, monthNames } from "@/lib/TimeUtils";
import { getXpThreshold } from "@/lib/UserUtils";
import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { MonthlyXpProgressDto, SkilsDistributionDto, UserLearningCompletionDto, WeeklyActivityEntry } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react";

const COLORS: Record<string, string> = {
    "Blank": "#3b82f6",
    "Java": "#8b5cf6",
    "C++": "#10b981",
    "Typescript": "#6b7280",
};

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
    if (!userId) redirect(DEFAULT_LOGIN_REDIRECT);

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

export const getSkillsDistribution = cache(async (): Promise<SkilsDistributionDto[]> => {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const skillsDistribution = await db.project.groupBy({
        by: ['template'],
        where: {
            ownerId: userId,
        },
        _count: {
            template: true,
        }
    });

    const totalCount = skillsDistribution.reduce((sum, item) => sum + item._count.template, 0);

    const formatted = skillsDistribution.map(item => {
        const count = item._count.template;
        const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;

        return {
            name: item.template ?? "Blank",
            value: count,
            percent,
            color: COLORS[item.template] ?? COLORS["Blank"],
        };
    });

    return formatted;
});

export const getMonthlyXpProgress = cache(async (): Promise<MonthlyXpProgressDto[]> => {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const currentYear = new Date().getFullYear();

    const lessonProgress = await db.lessonProgress.findMany({
        where: {
            userId,
            completed: true,
            accessedAt: {
                gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                lte: new Date(`${currentYear}-12-31T23:59:59Z`)
            }
        },
        include: {
            lesson: {
                include: {
                    Quiz: {
                        include: {
                            questions: true
                        }
                    }
                }
            }
        }
    });

    const xpByMonth = new Map<number, number>();

    lessonProgress.forEach(progress => {
        const monthIdx = progress.accessedAt.getMonth(); // 0-11

        const totalXpForLesson = progress.lesson?.Quiz?.questions.reduce((acc, q) => acc + q.rewardXp, 0) || 0;

        xpByMonth.set(monthIdx, (xpByMonth.get(monthIdx) || 0) + totalXpForLesson);
    });

    let cumulativeXp = 0;
    const monthlyProgress: MonthlyXpProgressDto[] = [];

    const currentMonthIdx = new Date().getMonth();

    for (let i = 0; i < currentMonthIdx + 1; i++) {
        const xpThisMonth = xpByMonth.get(i) || 0;
        cumulativeXp += xpThisMonth;

        let level = 1;
        while (getXpThreshold(level + 1) <= cumulativeXp) {
            level++;
        }

        monthlyProgress.push({
            month: monthNames[i],
            xp: cumulativeXp,
            level
        });
    }

    return monthlyProgress;
});
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, isValidSession } from "@/security/Security";
import { LearningLessonItem, LearningPathItem, UserCourseUnitDto } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getLearningPath = cache(async (courseId: string): Promise<LearningPathItem[]> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    const userId = await getCurrentlyLoggedInUserId();

    if (!courseId || !userId) {
        return [];
    }

    const [units, unitProgress, lessonProgress] = await Promise.all([
        db.unit.findMany({
            where: { courseId },
            include: {
                Lesson: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        order: true,
                    },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        }),

        db.unitProgress.findFirst({
            where: {
                userId,
                unit: { courseId }
            }
        }),

        db.lessonProgress.findMany({
            where: {
                userId,
                lesson: {
                    unit: {
                        courseId
                    }
                }
            }
        }),
    ]);

    const currentUnitId = unitProgress?.unitId ?? null;
    const completedLessonIds = new Set(
        lessonProgress
            .filter(lp => lp.completed)
            .map(lp => lp.lessonId)
    );

    const path: LearningPathItem[] = units.map((unit) => {
        const isCurrentUnit = unit.id === currentUnitId;

        const lessons: LearningLessonItem[] = unit.Lesson.map((lesson) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            return {
                lessonInfo: lesson,
                isCompleted,
                isCurrent: false,
                isAccessible: false,
            };
        });

        if (isCurrentUnit) {
            let foundCurrent = false;
            for (const lesson of lessons) {
                if (!lesson.isCompleted && !foundCurrent) {
                    lesson.isCurrent = true;
                    lesson.isAccessible = true;
                    foundCurrent = true;
                } else {
                    lesson.isAccessible = lesson.isCompleted;
                }
            }
        } else {
            for (const lesson of lessons) {
                lesson.isAccessible = lesson.isCompleted;
            }
        }

        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(l => l.isCompleted).length;

        const userCourseUnitDto: UserCourseUnitDto = {
            id: unit.id,
            name: unit.name,
            description: unit.description,
            order: unit.order,
            lessons,
        };

        return {
            unit: userCourseUnitDto,
            lessons,
            isCurrent: isCurrentUnit,
            isCompleted: completedLessons === totalLessons && totalLessons > 0,
            progress: {
                completedLessons,
                totalLessons,
            }
        };
    });

    return path;
});

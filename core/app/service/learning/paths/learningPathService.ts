import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, isValidSession } from "@/security/Security";
import { LearningLessonItem, LearningPathItem, UserCourseUnitDto } from "@/types/types";
import { redirect } from "next/navigation";

export const getLearningPath = async (courseId: string): Promise<LearningPathItem[]> => {
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

    const lessonProgressMap = new Map<string, { completed: boolean; progress: number }>();
    for (const lp of lessonProgress) {
        lessonProgressMap.set(lp.lessonId, {
            completed: lp.completed,
            progress: lp.progress ?? 0,
        });
    }

    let hasSetNextCurrent = false;

    const path: LearningPathItem[] = units.map((unit) => {
        const lessons: LearningLessonItem[] = unit.Lesson.map((lesson) => {
            const progressInfo = lessonProgressMap.get(lesson.id);
            return {
                lessonInfo: lesson,
                learningProgress: progressInfo?.progress ?? 0,
                isCompleted: progressInfo?.completed ?? false,
                isCurrent: false,
                isAccessible: false,
            };
        });

        const totalLessons = lessons.length;
        const completedLessons = lessons.filter(l => l.isCompleted).length;
        const isUnitCompleted = totalLessons > 0 && completedLessons === totalLessons;

        let isCurrent = false;

        if (unit.id === currentUnitId) {
            if (isUnitCompleted) {
                // unitatea marcată în DB ca curentă dar completă
                // -> nu o setăm current, căutăm următoarea
            } else {
                isCurrent = true;
                hasSetNextCurrent = true;
            }
        } else if (!hasSetNextCurrent && !isUnitCompleted) {
            // prima unitate necompletă după cele complete
            isCurrent = true;
            hasSetNextCurrent = true;
        } else if (!hasSetNextCurrent && currentUnitId === null) {
            // fallback: nu există deloc currentUnitId în DB
            isCurrent = true;
            hasSetNextCurrent = true;
        }

        if (isCurrent) {
            let found = false;
            for (const lesson of lessons) {
                if (!lesson.isCompleted && !found) {
                    lesson.isCurrent = true;
                    lesson.isAccessible = true;
                    found = true;
                } else {
                    lesson.isAccessible = lesson.isCompleted;
                }
            }
        } else {
            for (const lesson of lessons) {
                lesson.isAccessible = lesson.isCompleted;
            }
        }

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
            isCurrent,
            isCompleted: isUnitCompleted,
            progress: {
                completedLessons,
                totalLessons,
            }
        };
    });

    return path;
};
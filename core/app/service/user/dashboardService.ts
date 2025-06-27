import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { UserLearningCompletionDto } from "@/types/types";
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
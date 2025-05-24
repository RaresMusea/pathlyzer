import { courseExists } from "@/app/service/learning/course/courseService";
import { updateEnrollmentProgress } from "@/app/service/learning/course/enrollmentService";
import { getQuizById } from "@/app/service/learning/examination/quiz/quizService";
import { lessonExists } from "@/app/service/learning/lessons/lessonService";
import { getUnitIdByLessonId } from "@/app/service/learning/units/unitService";
import { getCompleteUserStats, updateUserStats } from "@/app/service/user/userStatsService";
import { getXpThreshold } from "@/lib/UserUtils";
import { db } from "@/persistency/Db";
import { FinalizeExaminationSchema } from "@/schemas/FinalizeExaminationSchema";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { UserStatsMutationDto } from "@/types/types";
import { Enrollment, Quiz, UnitProgress, UserStats } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const validateUrlParams = (params: { courseId: string, lessonId: string }) => {
    if (!params.courseId || !params.lessonId) {
        return false;
    }

    return true;
}

const handleApiError = (error: Error): NextResponse => {
    console.error(error);
    return NextResponse.json(
        { message: "Unexpected error", details: (error as Error)?.message },
        { status: 500 }
    );
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string, lessonId: string }> }): Promise<NextResponse> {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { courseId, lessonId } = await params;

    if (!validateUrlParams({ courseId, lessonId })) {
        return NextResponse.json({ message: "Invalid course or lesson ID!" }, { status: 400 });
    }

    if (!await courseExists(courseId)) {
        return NextResponse.json({ message: "Course does not exist!" }, { status: 404 });
    }

    if (!await lessonExists(lessonId)) {
        return NextResponse.json({ message: "Lesson does not exist!" }, { status: 404 });
    }

    const body = await request.json();
    const parsedBodyResult = FinalizeExaminationSchema.safeParse(body);

    if (!parsedBodyResult.success) {
        return NextResponse.json({ message: "Invalid payload!", details: parsedBodyResult.error.format() }, { status: 400 });
    }

    //TODO: Edit this once implementing the concept of unit exams
    const { quizId, gainedXp, isLastLesson } = parsedBodyResult.data;

    const quiz: Quiz | null = await getQuizById(quizId);

    if (!quiz) {
        return NextResponse.json({ message: "The quiz does not exist!" }, { status: 404 });
    }

    try {
        const userId = await getCurrentlyLoggedInUserIdApiRoute();

        if (userId !== currentUserId) {
            return NextResponse.json({ message: 'Unauthorized!' }, { status: 403 });
        }

        const userStats: UserStatsMutationDto | null = await getCompleteUserStats();

        if (!userStats) {
            return NextResponse.json({ message: `Cannot find user stats for this user!` }, { status: 404 });
        }

        let level: number = userStats.level;
        const newXp: number = userStats.xp + gainedXp;
        const xpThresholdCurrentLevel = getXpThreshold(userStats.level);

        if (xpThresholdCurrentLevel <= newXp) {
            level++;
        }

        const userStatsUpdateResult: UserStats | null = await updateUserStats({
            id: userStats.id,
            xp: newXp,
            level,
            userId,
            completedQuizzes: (userStats.completedQuizzes ?? 0) + 1,
            lives: userStats.lives
        })

        if (!userStatsUpdateResult) {
            return NextResponse.json({ message: 'Unable to update the user stats!' }, { status: 500 });
        }

        await db.lessonProgress.update({
            where: { userId_lessonId: { userId, lessonId } },
            data: { progress: 100, completed: true },
        });

        const unitId: string | null = await getUnitIdByLessonId(lessonId);

        if (!unitId) {
            return NextResponse.json({ message: 'The unit does not exist anymore!' }, { status: 500 });
        }

        if (isLastLesson) {
            const result: UnitProgress | null = await db.unitProgress.update({
                where: { userId_unitId: { userId, unitId } },
                data: { completed: true }
            });

            if (!result) {
                return NextResponse.json({ message: 'Unable to update unit progress!' }, { status: 500 });
            }

            const enrollmentUpdate: Enrollment | null = await updateEnrollmentProgress(courseId, userId);

            if (!enrollmentUpdate) {
                return NextResponse.json({ message: 'Unable to update user enrollment progress!' }, { status: 500 });
            }
        }

        return NextResponse.json({}, { status: 200 });

    } catch (error) {
        console.error(error);
        return handleApiError(error);
    }
}
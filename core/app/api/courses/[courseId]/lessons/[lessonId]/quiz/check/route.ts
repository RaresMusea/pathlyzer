import { courseExists } from "@/app/service/learning/course/courseService";
import { getQuestionById } from "@/app/service/learning/examination/quiz/questionService";
import { lessonExists } from "@/app/service/learning/lessons/lessonService";
import { loseLife } from "@/app/service/user/userStatsService";
import { ExaminationCheckSchema } from "@/schemas/ExaminationCheckSchema";
import { getCurrentlyLoggedInUserId, getCurrentlyLoggedInUserIdApiRoute, isValidSession } from "@/security/Security";
import { CheckResult, QuestionCheckDto } from "@/types/types";
import { QuestionType, UserStats } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const validateUrlParams = (params: { courseId: string, lessonId: string }) => {
    if (!params.courseId || !params.lessonId) {
        return false;
    }

    return true;
}

const handleApiError = (error: unknown): NextResponse => {
    console.error(error);
    return NextResponse.json(
        { message: "Unexpected error", details: (error as Error)?.message },
        { status: 500 }
    );
};

const validateChoiceBasedQuestion = (question: QuestionCheckDto, userAnswersIds: string[]): CheckResult => {
    const correctIds: string[] = question.choices.filter(choice => choice.isCorrect).map(choice => choice.id);

    return { isCorrect: correctIds.length === userAnswersIds.length && correctIds.every(id => userAnswersIds.includes(id)) };
}

const validateCodeFillQuestion = (question: QuestionCheckDto, userAnswer: string[]): CheckResult => {
    const correctAnswers = question.codeSection?.correct ?? [];
    const correctIndices = correctAnswers
        .map((answer, idx) => answer === (userAnswer[idx]?.trim() ?? '') ? idx : -1)
        .filter(idx => idx !== -1);

    return {
        isCorrect: correctIndices.length === correctAnswers.length,
        correctIndices
    }
}

const checkExaminationPart = (question: QuestionCheckDto, userAnswer: string[]): CheckResult => {
    switch (question.type) {
        case QuestionType.SINGLE:
        case QuestionType.MULTIPLE:
            return validateChoiceBasedQuestion(question, userAnswer);
        case QuestionType.CODE_FILL:
            return validateCodeFillQuestion(question, userAnswer);
        default:
            throw new Error("Unsupported question type");
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ courseId: string, lessonId: string }> }): Promise<NextResponse> {
    if (!await isValidSession()) {
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
    const parsedBodyResult = ExaminationCheckSchema.safeParse(body);

    if (!parsedBodyResult.success) {
        return NextResponse.json({ message: "Invalid payload!", details: parsedBodyResult.error.format() }, { status: 400 });
    }

    const { quizType, questionId, answer } = parsedBodyResult.data;
    console.log(`Checking question ${questionId} for quiz type ${quizType}-${lessonId}`);

    const question: QuestionCheckDto | null = await getQuestionById(questionId);

    if (!question) {
        return NextResponse.json({ message: "Question does not exist!" }, { status: 404 });
    }

    const result: CheckResult = checkExaminationPart(question, answer);

    if (!result.isCorrect) {
        try {
            const userId = await getCurrentlyLoggedInUserIdApiRoute();
            const penaltyResult: UserStats | null = await loseLife(userId as string);

            if (!penaltyResult) {
                return NextResponse.json({ message: "Failed to apply penalty!" }, { status: 500 });
            }

            return NextResponse.json({ status: 'incorrect', penalty: { newLives: penaltyResult.lives }, result }, { status: 200 });

        } catch (error) {
            return handleApiError(error);
        }
    }

    return NextResponse.json({ status: 'correct', result, xpReward: question.rewardXp }, { status: 200 });
}
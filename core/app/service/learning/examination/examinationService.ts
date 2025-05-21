import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { QuestionType, QuizType } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getQuizIdByLessonId } from "../quiz/quizService";
import { db } from "@/persistency/Db";
import { AnswerChoiceDto, BaseQuestionDto, ExaminationClientViewDto } from "@/types/types";
import { getClientAnswerChoices, getClientCodeSection } from "./quiz/questionService";
import { shuffleArray } from "@/lib/Generics";

export const getClientViewQuestions = cache(async (
    quizType: QuizType,
    id: string
): Promise<ExaminationClientViewDto[] | null> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    if (quizType === QuizType.LESSON_QUIZ) {
        const quizId: string | null = await getQuizIdByLessonId(id);
        if (!quizId) return null;

        const questions: BaseQuestionDto[] = await db.question.findMany({
            where: { quizId },
            select: {
                id: true,
                type: true,
                order: true,
                rewardXp: true,
                prompt: true,
            }
        });

        const mappedQuestions = await Promise.all(
            questions.map(async (question): Promise<ExaminationClientViewDto | null> => {
                if (question.type === QuestionType.CODE_FILL) {
                    const maskedCodeSection = await getClientCodeSection(question.id!);
                    if (!maskedCodeSection) return null;

                    return {
                        ...question,
                        codeSection: maskedCodeSection,
                    };
                }

                if (question.type === QuestionType.SINGLE || question.type === QuestionType.MULTIPLE) {
                    const answerChoices: AnswerChoiceDto[] = await getClientAnswerChoices(question.id as string);
                    if (!answerChoices || answerChoices.length === 0) return null;

                    return {
                        ...question,
                        answerChoices: shuffleArray(answerChoices)
                    };
                }

                return {
                    ...question,
                };
            })
        );

        const filteredQuestions: ExaminationClientViewDto[] = mappedQuestions.filter((q): q is ExaminationClientViewDto => q !== null);
        return shuffleArray(filteredQuestions);
    }

    return null;
});

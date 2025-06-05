import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { AnswerChoiceDto, CodeSectionDto, QuestionCheckDto } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react"

const maskCodeForClient = (originalCode: string): string => {
    return originalCode.replace(/~~.*?~~/g, '~~_~~');
}

export const getClientCodeSection = cache(async (questionId: string): Promise<CodeSectionDto | null> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result = await db.codeSection.findFirst({
        where: { questionId: questionId.trim() },
        select: { id: true, code: true, language: true }
    });

    if (!result) return null;

    return {
        ...result,
        code: maskCodeForClient(result.code),
        language: result.language ?? undefined
    };
});

export const getClientAnswerChoices = cache(async (
    questionId: string
): Promise<AnswerChoiceDto[]> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    return await db.answerChoice.findMany({
        where: { questionId: questionId.trim() },
        select: { id: true, questionId: true, text: true },
    });
});

export const getQuestionById = cache(async (questionId: string): Promise<QuestionCheckDto | null> => {
    if (!await isValidSession()) {
        throw new Error("Unauthorized");
    }

    const dbResult = await db.question.findUnique({
        where: {
            id: questionId,
        },
        select: {
            id: true,
            type: true,
            rewardXp: true,
            choices: {
                select: {
                    id: true,
                    isCorrect: true,
                }
            },
            CodeSection: {
                select: {
                    correct: true,
                }
            }
        },
    });

    if (!dbResult) {
        return null;
    }

    const question: QuestionCheckDto = {
        id: dbResult.id,
        type: dbResult.type,
        rewardXp: dbResult.rewardXp,
        choices: dbResult.choices,
        codeSection: {
            correct: dbResult.CodeSection?.[0]?.correct ?? []
        }
    };

    return question;
});

"use server";

import { UNAUTHORIZED_REDIRECT } from "@/routes";
import { FullLessonFormType, FullLessonSchema } from "@/schemas/LessonCreatorSchema";
import { isValidAdminSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { handleError, handleSuccess, ServerActionResult } from "./globals/Generics";
import { getHighestOrderLesson, lessonContainedByUnit } from "@/app/service/learning/lessons/lessonService";
import { db } from "@/persistency/Db";
import { QuestionType } from "@prisma/client";
import { z } from "zod";

const validate = async (values: FullLessonFormType): Promise<z.SafeParseReturnType<FullLessonFormType, FullLessonFormType>> => {
    if (await !isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const validatedFields = FullLessonSchema.safeParse(values);

    return validatedFields;
}

export async function saveFullLesson(values: FullLessonFormType, unitId: string): Promise<ServerActionResult> {
    const validated = await validate(values);

    if (!validated.success) {
        return handleError(validated.error.message);
    }

    if (!unitId) {
        return handleError('The unit ID cannot be empty!');
    }

    const { details, content, quiz } = values;

    if (await lessonContainedByUnit(unitId, details.title)) {
        return handleError('A lesson with the same name was already added within this unit!');
    }

    try {
        await db.$transaction(async (tx) => {
            const lesson = await tx.lesson.create({
                data: {
                    title: details.title,
                    description: details.description,
                    content: content.content,
                    order: (await getHighestOrderLesson(unitId)) + 1,
                    unit: { connect: { id: unitId } }
                }
            });

            const createdQuiz = await tx.quiz.create({
                data: {
                    title: quiz.title,
                    type: quiz.type,
                    lessonId: lesson.id,
                },
            });

            for (const question of quiz.questions) {
                const createdQuestion = await tx.question.create({
                    data: {
                        quizId: createdQuiz.id,
                        type: question.type,
                        order: question.order,
                        prompt: question.prompt,
                        rewardXp: question.rewardXp,
                    },
                });

                if (question.type === QuestionType.SINGLE || question.type === QuestionType.MULTIPLE && question.choices) {
                    await tx.answerChoice.createMany({
                        data: question.choices.map((choice) => ({
                            questionId: createdQuestion.id,
                            text: choice.text,
                            isCorrect: choice.isCorrect,
                        })),
                    });
                }

                if (question.type === QuestionType.CODE_FILL && question.codeSection) {
                    await tx.codeSection.create({
                        data: {
                            questionId: createdQuestion.id,
                            code: question.codeSection.code,
                            language: question.codeSection.language,
                            correct: question.codeSection.correct,
                        },
                    });
                }
            }
        });

        return handleSuccess('The lesson and associated quiz have been successfully created.')
    } catch (error) {
        console.error(error);
        return handleError('An unexpected error occurred while attempting to save the lesson, along with its associated quiz. Please try again later.');
    }
}
import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { Quiz } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getQuizById = cache(async (quizId: string): Promise<Quiz | null> => {
    if (!await isValidSession()) {
        throw new Error('Unauthorized!');
    }

    const result: Quiz | null = await db.quiz.findUnique({ where: { id: quizId } });

    return result ?? null;
});

export const getQuizIdByLessonId = cache(async (lessonId: string): Promise<string | null> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result: { id: string } | null = await db.quiz.findFirst({ where: { lessonId }, select: { id: true } });

    return result && (result.id ?? null);
});
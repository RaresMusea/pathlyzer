import { db } from "@/persistency/Db";
import { isValidSession } from "@/security/Security";
import { Quiz } from "@prisma/client";
import { cache } from "react";

export const getQuizById = cache(async (quizId: string): Promise<Quiz | null> => {
    if (!await isValidSession()) {
        throw new Error('Unauthorized!');
    }

    const result: Quiz | null = await db.quiz.findUnique({ where: { id: quizId } });

    return result ?? null;
});
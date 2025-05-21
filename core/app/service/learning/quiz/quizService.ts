import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getQuizIdByLessonId = cache(async (lessonId: string): Promise<string | null> => {
    if (!isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result: {id: string} | null = await db.quiz.findFirst({where: { lessonId }, select: { id: true }});

    return result ? result.id : null;
});
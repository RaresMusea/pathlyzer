import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { isValidSession } from "@/security/Security";
import { LearningSession } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getLearningSession = cache(async (sessionId: string): Promise<LearningSession | null> => {
    if (!isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT)
    }

    const session = await db.learningSession.findUnique({ where: { id: sessionId } });

    return session ?? null;
})
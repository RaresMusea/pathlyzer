import { DEFAULT_LOGIN_REDIRECT, LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, getCurrentlyLoggedInUserIdApiRoute, isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { getLowerstOrderLessonId, lessonExists } from "./lessonService";
import { db } from "@/persistency/Db";
import { LessonProgress } from "@prisma/client";

export const initializeLessonProgressOnEnroll = async (unitId: string): Promise<LessonProgress | null> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    if (!unitId) {
        throw new Error('The unit ID cannot be empty!');
    }

    const firstLessonId: string | null = await getLowerstOrderLessonId(unitId);

    if (!firstLessonId) {
        throw new Error('There are not lessons available!');
    }

    return await addLessonProgress(firstLessonId) ?? null;
}

export const addLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
    const userId: string = await getCurrentlyLoggedInUserId()

    if (!userId) {
        redirect(LOGIN_PAGE);
    }

    if (!lessonId) {
        throw new Error('The lesson ID cannot be empty!');
    }

    const result: LessonProgress | null = await db.lessonProgress.create({
        data: {
            lessonId,
            userId
        }
    })

    return result ?? null;
}

export const getCurrentUserLessonProgress = async (lessonId: string): Promise<number | null> => {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    if (!await lessonExists(lessonId)) {
        throw new Error('The specified lesson could not be found! Maybe it got removed or your access over it was revoked in the meantime!');
    }

    const result: { progress: number } | null = await db.lessonProgress.findFirst({
        where: { lessonId },
        select: { progress: true }
    });

    if (!result) {
        return null;
    }

    return result.progress;
}
import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { getLowerstOrderLessonId } from "./lessonService";
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
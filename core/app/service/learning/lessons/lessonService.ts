import { db } from "@/persistency/Db";
import { LOGIN_PAGE, UNAUTHORIZED_REDIRECT } from "@/routes";
import { isValidAdminSession, isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getLowerstOrderLessonId = cache(async (unitId: string): Promise<string | null> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    const result: { id: string } | null = await db.lesson.findFirst({
        where: {
            unitId,
        },
        orderBy: {
            order: 'asc',
        },
        select: {
            id: true,
        },
    });

    return result?.id ?? null;
});

export const lessonContainedByUnit = cache(async (unitId: string, lessonName: string): Promise<boolean> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const containsLesson: boolean = !!await db.lesson.findFirst({where: { unitId, title: lessonName }, select: {id: true} });

    return containsLesson;
});

export const getHighestOrderLesson = async (unitId: string): Promise<number> => {
    const maxOrder = await db.lesson.aggregate({
        _max: {
            order: true,
        },
        where: { unitId }
    });

    return maxOrder._max.order ?? 0;
}
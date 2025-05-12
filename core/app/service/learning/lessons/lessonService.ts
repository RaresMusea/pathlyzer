import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { isValidSession } from "@/security/Security";
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
})
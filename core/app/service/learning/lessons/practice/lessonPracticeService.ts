import { db } from "@/persistency/Db";
import { isValidSession } from "@/security/Security";
import { LessonPracticeDto } from "@/types/types";
import { cache } from "react";

export const getLessonPracticeByLessonId = cache(async (lessonId: string): Promise<LessonPracticeDto | null> => {
    if (!await isValidSession()) {
        throw new Error("Unauthorized!");
    }

    const practice = await db.lessonPractice.findFirst({
        where: { lessonId },
        include: {
            items: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    duration: true
                }
            }
        }
    });

    return practice
        ? {
            id: practice.id,
            lessonId: practice.lessonId,
            items: practice.items
        }
        : null;
});
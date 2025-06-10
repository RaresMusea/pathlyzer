import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT, LOGIN_PAGE, UNAUTHORIZED_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute, isValidAdminSession, isValidSession } from "@/security/Security";
import { LessonContentDto, LessonDto } from "@/types/types";
import { notFound, redirect } from "next/navigation";
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

    const containsLesson: boolean = !!await db.lesson.findFirst({ where: { unitId, title: lessonName }, select: { id: true } });

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

export const getLessonContent = cache(async (lessonId: string): Promise<LessonContentDto | null> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const lessonContent: LessonContentDto | null = await db.lesson.findUnique({ where: { id: lessonId }, select: { title: true, content: true } });

    return lessonContent ?? null;
});

export const lessonExists = cache(async (lessonId: string): Promise<boolean | null> => {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        return null;
    }

    const lessonExists: boolean = !!(await db.lesson.findUnique({ where: { id: lessonId }, select: { id: true } }));

    return lessonExists;
});

export const getLessonOrder = cache(async (lessonId: string): Promise<number> => {
    if (!await isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result: { order: number } | null = await db.lesson.findUnique({ where: { id: lessonId }, select: { order: true } })

    if (!result) {
        return notFound();
    }

    return result.order;
});

export const rearrangeLessons = async (lessons: LessonDto[]): Promise<void> => {
    if (!await isValidAdminSession()) {
        throw new Error('Unauthorized!');
    }

    const tempUpdates = lessons.map((lesson, index) =>
        db.lesson.update({
            where: { id: lesson.id },
            data: { order: -(index + 1) },
        })
    );

    const finalUpdates = lessons.map((lesson, index) =>
        db.lesson.update({
            where: { id: lesson.id },
            data: { order: index + 1 },
        })
    );

    await db.$transaction([...tempUpdates, ...finalUpdates]);
};
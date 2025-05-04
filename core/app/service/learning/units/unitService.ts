import { fromUnitToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { isValidSession } from "@/security/Security";
import { CourseUnitDto } from "@/types/types";
import { redirect } from "next/navigation";
import { cache } from "react"

export const getUnits = cache(async (courseId: string): Promise<CourseUnitDto[]> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    if (!courseId) {
        return [];
    }

    const units = await db.unit.findMany({
        where: {
            courseId,
        },
        include: {
            Lesson: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    order: true,
                },
                orderBy: { order: 'asc' }
            },
        },
        orderBy: {
            order: 'asc'
        }
    });

    const courseUnitDtos: CourseUnitDto[] = units.map((unit) => {
        return fromUnitToDto(unit, unit.Lesson);
    });

    return courseUnitDtos;
});

export const getLowerstOrderUnitId = cache(async (courseId: string): Promise<string | null> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    const result: { id: string } | null = await db.unit.findFirst({
        where: {
            courseId: courseId,
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
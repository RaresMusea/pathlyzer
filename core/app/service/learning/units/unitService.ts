import { fromUnitToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE, UNAUTHORIZED_REDIRECT } from "@/routes";
import { isValidAdminSession, isValidSession } from "@/security/Security";
import { CourseUnitDto, UnitRearrangementDto } from "@/types/types";
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

export const rearrangeUnits = async (units: UnitRearrangementDto[]): Promise<void> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const tempUpdates = units.map((unit, index) =>
        db.unit.update({
            where: { id: unit.id },
            data: { order: -(index + 1) },
        })
    );

    const finalUpdates = units.map((unit, index) =>
        db.unit.update({
            where: { id: unit.id },
            data: { order: index + 1 },
        })
    );

    await db.$transaction([...tempUpdates, ...finalUpdates]);
};
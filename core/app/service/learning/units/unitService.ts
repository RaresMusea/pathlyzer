import { fromUnitToDto, fromUnitToMutationDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE, UNAUTHORIZED_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute, isValidAdminSession, isValidSession } from "@/security/Security";
import { BasicLessonDto, CourseUnitDto, UnitMutationDto, UnitRearrangementDto } from "@/types/types";
import { Unit } from "@prisma/client";
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

export const getLessonsByUnitId = cache(async (unitId: string): Promise<BasicLessonDto[] | null> => {
    if (!isValidAdminSession()) {
        throw new Error('Unauthorized!');
    }

    const lessons: BasicLessonDto[] = await db.lesson.findMany({
        where: { unitId },
        select: { id: true, title: true, order: true, description: true },
        orderBy: { order: 'asc' }
    });

    return lessons;
})


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

const getHighestOrderUnit = async (courseId: string): Promise<number> => {
    const maxOrder = await db.unit.aggregate({
        _max: {
            order: true,
        },
        where: { courseId: courseId }
    });

    return maxOrder._max.order ?? 0;
}

export const addUnit = async (unitData: UnitMutationDto, courseId: string): Promise<Unit | null> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const createdUnit: Unit | null = await db.unit.create({
        data: {
            name: unitData.name,
            description: unitData.description,
            order: (await getHighestOrderUnit(courseId)) + 1,
            course: { connect: { id: courseId } }
        }
    });

    return createdUnit ?? null;
}

export const getSummarizedUnitDataById = cache(async (unitId: string): Promise<UnitMutationDto | null> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const requestedUnit: Unit | null = await db.unit.findUnique({ where: { id: unitId } });

    if (requestedUnit) {
        return fromUnitToMutationDto(requestedUnit);
    }

    return null;
})

export const unitWithIdAlreadyExists = cache(async (unitId: string): Promise<boolean> => {
    if (!(await isValidAdminSession())) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const requestedId = await db.unit.findUnique({
        where: { id: unitId },
        select: { id: true },
    });

    return !!requestedId;
});

export const deleteUnit = async (unitId: string): Promise<boolean> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const deletedUnit: Unit | null = await db.unit.delete({ where: { id: unitId } });

    if (deletedUnit) {
        return true;
    }

    return false;
};

export const getUnitOrderById = cache(async (unitId: string): Promise<number | null> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const unitOrder: { order: number } | null = await db.unit.findUnique({ where: { id: unitId }, select: { order: true } });

    return unitOrder?.order ?? null;
});

export const getUnitIdByLessonId = cache(async (lessonId: string): Promise<string | null> => {
    if (!await isValidSession()) {
        throw new Error('Unauthorized!');
    }

    const result: { unitId: string } | null = await db.lesson.findUnique({ where: { id: lessonId }, select: { unitId: true } });

    return result && (result.unitId ?? null);
});

export const getUnitsCount = cache(async (courseId: string): Promise<number> => {
    if (!await isValidSession()) {
        throw new Error('Unauthorized!');
    }

    return await db.unit.count({ where: { courseId } });
});

export const getCompletedUnitsCount = cache(async (userId: string): Promise<number> => {
    const loggedInUser = await getCurrentlyLoggedInUserIdApiRoute();

    if (!loggedInUser || !(loggedInUser === userId)) {
        throw new Error('Unauthorized!');
    }

    return db.unitProgress.count({ where: { userId, completed: true } });
});
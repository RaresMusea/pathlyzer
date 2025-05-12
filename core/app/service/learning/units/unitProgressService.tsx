import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { getLowerstOrderUnitId } from "./unitService";
import { db } from "@/persistency/Db";
import { UnitProgress } from "@prisma/client";

export const initializeUnitProgressOnEnroll = async (courseId: string) => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    if (!courseId) {
        throw new Error('The course ID cannot be empty!');
    }

    const firstUnitId: string | null = await getLowerstOrderUnitId(courseId);

    if (!firstUnitId) {
        throw new Error('There are not units available!');
    }

    return await addUnitProgress(firstUnitId) ?? null;
}

export const addUnitProgress = async (unitId: string): Promise<UnitProgress | null> => {
    const userId: string = await getCurrentlyLoggedInUserId();

    if (!userId) {
        redirect(LOGIN_PAGE);
    }

    if (!unitId) {
        throw new Error('The unit ID cannot be empty!');
    }

    const result: UnitProgress | null = await db.unitProgress.create({
        data: {
            unitId,
            userId
        }
    })

    return result ?? null;
}
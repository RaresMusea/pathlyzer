import { db } from "@/persistency/Db";
import { UserStats } from "@prisma/client";
import { cache } from "react";

export const getStatsByUserId = cache(async (userId: string): Promise<UserStats | null> => {
    return await db.userStats.findUnique({ where: { userId } });
});

export const createUserStats = cache(async (userId: string): Promise<UserStats | null> => {
    const existing = await getStatsByUserId(userId);
    if (existing) throw new Error("Stats already exist for this user");

    return await db.userStats.create({
        data: { userId },
    });
});
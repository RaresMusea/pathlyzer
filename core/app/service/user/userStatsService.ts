import { auth } from "@/auth";
import { fromUserStatsToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId } from "@/security/Security";
import { SummarizedUserStats, UserStatsDto } from "@/types/types";
import { select } from "@heroui/theme";
import { UserStats } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getStatsByUserId = cache(async (userId: string): Promise<UserStats | null> => {
    return await db.userStats.findUnique({ where: { userId } });
});

export const getUserStats = cache(async (): Promise<UserStatsDto | null> => {
    const userId: string = await getCurrentlyLoggedInUserId();

    const stats: UserStatsDto | null = await db.userStats.findUnique({
        where: { userId },
        select: { userId: false, updatedAt: false, id: true, lives: true, xp: true, level: true }
    });

    return stats ?? null;
});

export const createUserStats = cache(async (userId: string): Promise<UserStats | null> => {
    const existing = await getStatsByUserId(userId);
    if (existing) return null;

    return await db.userStats.create({
        data: { userId },
    });
});

export const createAuthorizedUserStats = cache(async (): Promise<UserStatsDto | null> => {
    const userId: string = await getCurrentlyLoggedInUserId();

    const createdStats: UserStats | null = await createUserStats(userId);

    if (createdStats !== null) {
        return fromUserStatsToDto(createdStats);
    }

    return null;
});

export const getSummarizedUserStats = cache(async (): Promise<SummarizedUserStats | null> => {
    const userId: string = await getCurrentlyLoggedInUserId();

    if (!userId) {
        redirect(LOGIN_PAGE);
    }

    const userStats: SummarizedUserStats | null = await db.userStats.findUnique({ where: { userId: userId }, select: { lives: true, xp: true } })

    return userStats ?? null;
});
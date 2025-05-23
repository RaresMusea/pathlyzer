import { fromUserStatsToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { getCurrentlyLoggedInUserId, getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { SummarizedUserStats, UserStatsDto } from "@/types/types";
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

    const userStats: SummarizedUserStats | null = await db.userStats.findUnique({ where: { userId: userId }, select: { lives: true, xp: true, level: true } })

    return userStats ?? null;
});

export const loseLife = async (userId: string): Promise<UserStats> => {
    const sessionUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (sessionUserId !== userId) {
        throw new Error("Unauthorized");
    }

    const updated = await db.userStats.updateMany({
        where: { userId, lives: { gt: 0 } },
        data: { lives: { decrement: 1 } },
    });

    if (updated.count === 0) {
        throw new Error("No lives left to lose");
    }

    const stats = await db.userStats.findUnique({
        where: { userId },
    });

    if (!stats) {
        throw new Error("User stats missing after update");
    }

    return stats;
}

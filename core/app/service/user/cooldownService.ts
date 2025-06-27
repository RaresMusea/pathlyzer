import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { CooldownReason, UserCooldown } from "@prisma/client";
import { cache } from "react";

export const applyCooldown = async (reason: CooldownReason): Promise<UserCooldown | null> => {
    const userId: string | null = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        throw new Error("Unauthorized!");
    }

    const cooldown = await db.userCooldown.upsert({
        where: { userId },
        update: {
            reason,
            startedAt: new Date(),
            durationMinutes: reason === CooldownReason.NORMAL ? 30 : 60,
        },
        create: {
            userId,
            reason,
            durationMinutes: reason === CooldownReason.NORMAL ? 30 : 60,
        },
    });

    return cooldown ?? null;
}

export const getUserCooldown = cache(async (): Promise<UserCooldown | null> => {
    const userId: string | null = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        throw new Error("Unauthorized!");
    }

    const userCooldown: UserCooldown | null = await db.userCooldown.findFirst({
        where: { userId },
        orderBy: { startedAt: 'desc' },
    });

    return userCooldown;
})
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { CooldownReason, UserCooldown } from "@prisma/client";

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
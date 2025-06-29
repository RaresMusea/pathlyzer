import { getUserStats } from "@/app/service/user/userStatsService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { CooldownReason, UserCooldown } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    console.log(request);
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }

    const userStats = await getUserStats();

    if (!userStats) {
        return NextResponse.json({ message: 'User stats not found!' }, { status: 404 });
    }

    const now = new Date();

    const lastCooldown: UserCooldown | null = await db.userCooldown.findFirst({
        where: {
            userId: currentUserId,
            reason: CooldownReason.FRAUD
        },
        orderBy: {
            startedAt: 'desc'
        }
    });

    if (lastCooldown) {
        const cooldownEnd = new Date(lastCooldown.startedAt.getTime() + lastCooldown.durationMinutes * 60 * 1000);

        if (now < cooldownEnd) {
            return NextResponse.json({
                message: 'Another active penalty cooldown is still in effect.',
                cooldownEndsAt: cooldownEnd
            }, { status: 400 });
        }
    }

    try {
        await db.$transaction([
            db.userCooldown.create({
                data: {
                    userId: currentUserId,
                    reason: CooldownReason.FRAUD,
                    startedAt: now,
                    durationMinutes: 60
                }
            }),
            db.userStats.update({
                where: { userId: currentUserId },
                data: { lives: 0 }
            })
        ]);

        return NextResponse.json({ message: 'Penalty applied successfully!', lives: 0 }, { status: 200 });

    } catch (err) {
        console.error('Error while applying penalty:', err);
        return NextResponse.json({ message: 'An error occurred while processing the penalty.' }, { status: 500 });
    }
}

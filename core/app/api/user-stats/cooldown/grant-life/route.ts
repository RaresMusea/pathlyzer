import { getUserStats } from "@/app/service/user/userStatsService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { UserCooldown } from "@prisma/client";
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

    const userCooldown: UserCooldown | null = await db.userCooldown.findFirst({
        where: {
            userId: currentUserId
        }
    });

    if (!userCooldown) {
       return NextResponse.json({ message: 'Life not granted: either cooldown not expired or lives > 0.' }, { status: 400 });
    }

    const cooldownStart: Date = userCooldown.startedAt;
    const cooldownDurationMs: number = userCooldown.durationMinutes * 60 * 1000;
    const cooldownEnd = new Date(cooldownStart.getTime() + cooldownDurationMs);
    const now = new Date();

    if (now > cooldownEnd && userStats.lives === 0) {
        try {
            await db.$transaction([
                db.userCooldown.deleteMany({
                    where: {
                        userId: currentUserId,
                    },
                }),
                db.userStats.update({
                    where: {
                        userId: currentUserId,
                    },
                    data: {
                        lives: {
                            increment: 1,
                        },
                    },
                }),
            ]);

            return NextResponse.json({ message: 'Life granted and cooldown removed!', lives: 1 }, { status: 200 });
        } catch (err) {
            console.error('Error');
            return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
}
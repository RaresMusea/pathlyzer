import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cooldown = await db.userCooldown.findUnique({ where: { userId } });

    if (!cooldown) {
        return NextResponse.json({ active: false }, { status: 200 });
    }

    const endTime = new Date(cooldown.startedAt.getTime() + cooldown.durationMinutes * 60_000);
    const remaining = Math.max(0, Math.ceil((endTime.getTime() - Date.now()) / 1000));

    if (remaining <= 0) {
        await db.userCooldown.delete({ where: { userId } });
        return NextResponse.json({ active: false }, { status: 200 });
    }

    return NextResponse.json({
        active: true,
        remainingSeconds: remaining,
        reason: cooldown.reason
    }, { status: 200 });
}

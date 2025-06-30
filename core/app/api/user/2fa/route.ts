import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(request);
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { id: currentUserId },
        select: { is2FAEnabled: true }
    });

    if (!user) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
        is2FAEnabled: user.is2FAEnabled
    });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { enabled } = body;

        if (typeof enabled !== "boolean") {
            return NextResponse.json({ message: "Invalid payload. Expected { enabled: boolean }." }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { id: currentUserId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        await db.user.update({
            where: { id: currentUserId },
            data: { is2FAEnabled: enabled }
        });

        return NextResponse.json({
            message: `Two-Factor Authentication was successfully ${enabled ? "enabled" : "disabled"}.`
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating 2FA:", error);
        return NextResponse.json({ message: "Failed to update Two-Factor Authentication." }, { status: 500 });
    }
}
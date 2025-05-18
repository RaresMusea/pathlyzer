import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();
    if (!currentUserId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!request.body) {
        return NextResponse.json(
            { message: "Request body is required" },
            { status: 400 }
        );
    }

    let requestBody;

    try {
        const bodyText = await request.text();

        if (!bodyText.trim()) {
            return NextResponse.json(
                { message: "Empty request body" },
                { status: 400 }
            );
        }

        requestBody = JSON.parse(bodyText);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Invalid JSON format" },
            { status: 400 }
        );
    }

    const { sessionId, duration = 0 } = requestBody;

    if (!sessionId || typeof duration !== "number") {
        return NextResponse.json(
            { message: "sessionId (string) and duration (number) are required" },
            { status: 400 }
        );
    }

    try {
        const session = await db.learningSession.findFirst({
            where: {
                id: sessionId,
                userId: currentUserId,
                endedAt: null
            }
        });

        if (!session) {
            return NextResponse.json(
                { message: "Session not found or already ended" },
                { status: 404 }
            );
        }

        await db.learningSession.update({
            where: { id: sessionId },
            data: {
                endedAt: new Date(),
                duration: Math.max(1, Math.floor(duration))
            }
        });

        return NextResponse.json({
            success: true,
            duration: `${duration}s`
        });
    } catch (error) {
        console.error("Error ending session:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
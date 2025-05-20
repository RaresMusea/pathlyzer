import { lessonExists } from "@/app/service/learning/lessons/lessonService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await request.json();

    const exists = await lessonExists(lessonId);
    if (exists === null) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    if (!exists) {
        return NextResponse.json({
            message: "Lesson not found or access denied",
        }, { status: 404 });
    }

    try {
        const session = await db.learningSession.create({
            data: {
                userId: currentUserId,
                lessonId,
                startedAt: new Date(),
            },
        });

        return NextResponse.json(
            {
                message: "Learning session started",
                sessionId: session.id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Session creation failed", error);
        return NextResponse.json(
            { message: "Failed to start learning session" },
            { status: 500 }
        );
    }
}
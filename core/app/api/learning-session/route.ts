import { getLearningSession } from "@/app/service/learning/learning-session/learningSessionService";
import { lessonExists } from "@/app/service/learning/lessons/lessonService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { LearningSession } from "@prisma/client";
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
            message: "The lesson could not be found. It may have been deleted or you lack access rights.",
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
            { message: `Started a learning session at ${session.startedAt}` },
            { status: 201 }
        );
    } catch (error) {
        console.error("Session creation failed", error);
        return NextResponse.json({ message: "Unable to initiate learning session" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    const learningSession: LearningSession | null = await getLearningSession(sessionId);

    if (!learningSession) {
        return NextResponse.json({ message: 'Learning session could not be found!' }, { status: 404 });
    }

    const endedAt = new Date();
    const duration = Math.floor((endedAt.getTime() - new Date(learningSession.startedAt).getTime()) / 1000);

    try {
        const updatedSession = await db.learningSession.update({
            where: { id: sessionId }, data: { endedAt, duration }
        });

        if (updatedSession) {
            return NextResponse.json({ message: `Learning session ended at ${endedAt}.` }, { status: 200 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: `An unexpected error occurred while attempting to end your learning session.` }, { status: 500 });
    }

    return NextResponse.json({ message: `An unexpected error occurred while attempting to end your learning session.` }, { status: 500 });
}
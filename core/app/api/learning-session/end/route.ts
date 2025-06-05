import { ProgressType } from "@/hooks/useLearningSession";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const userId = await getCurrentlyLoggedInUserIdApiRoute();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null) as
        | null
        | { lessonId?: string; sessionId?: string; duration?: number; progressType?: ProgressType; progress?: number };

    if (!body)
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });

    const { lessonId, sessionId, duration = 0, progressType, progress } = body;

    if (!sessionId || typeof duration !== "number")
        return NextResponse.json({ message: "sessionId & duration are required" }, { status: 400 });

    try {
        const session = await db.learningSession.findFirst({
            where: { id: sessionId, userId, endedAt: null },
        });
        if (!session)
            return NextResponse.json({ message: "Session not found / ended" }, { status: 404 });

        await db.learningSession.update({
            where: { id: sessionId },
            data: { endedAt: new Date(), duration: Math.max(1, Math.floor(duration)) },
        });

        if (progressType === 0 && lessonId && progress) {
            console.warn("Saving progress", progress);
            await db.lessonProgress.upsert({
                where: { userId_lessonId: { userId, lessonId } },
                create: { userId, lessonId, progress },
                update: { progress: progress >= 97 ? 100 : progress },
            });
        }
        else {
            return NextResponse.json({ message: "Invalid progress type" }, { status: 400 });
        }

        return NextResponse.json({ success: true, duration: `${duration}s` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

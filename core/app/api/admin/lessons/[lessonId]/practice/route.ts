import { getLessonById } from "@/app/service/learning/lessons/lessonService";
import { db } from "@/persistency/Db";
import { PracticePayloadSchema } from "@/schemas/PracticeSectionSchema";
import { isValidAdminSession } from "@/security/Security";
import { LessonDto, LessonPracticeItemDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ lessonId: string }> }): Promise<NextResponse> {
    if (!isValidAdminSession()) {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }

    const lessonId = (await params).lessonId;
    const body = (await request.json()) as LessonPracticeItemDto[];
    const validatedFields = PracticePayloadSchema.safeParse(body);

    if (!validatedFields.success) {
        return NextResponse.json({ message: validatedFields.error.message }, { status: 400 });
    }

    const lesson: LessonDto | null = await getLessonById(lessonId);

    if (!lesson) {
        return NextResponse.json({ message: 'The lesson could not be found or it is innaccessible!' }, { status: 404 });
    }

    const lessonPractice = await db.lessonPractice.upsert({
        where: { lessonId },
        update: {},
        create: { lessonId },
    });

    const incoming = body;
    const existing = await db.lessonPracticeItem.findMany({
        where: { lessonPracticeId: lessonPractice.id },
        select: { id: true }
    });

    const existingIds = new Set(existing.map(i => i.id));
    const incomingIds = new Set(incoming.filter(i => i.id).map(i => i.id!));

    const toCreate = incoming.filter(i => !i.id);
    const toUpdate = incoming.filter(i => i.id && existingIds.has(i.id));
    const toDeleteIds = [...existingIds].filter(id => !incomingIds.has(id));

    try {
        await db.$transaction([
            ...toCreate.map((it) =>
                db.lessonPracticeItem.create({
                    data: {
                        lessonPracticeId: lessonPractice.id,
                        title: it.title,
                        content: it.content,
                        duration: it.duration
                    }
                })
            ),

            ...toUpdate.map((it) =>
                db.lessonPracticeItem.update({
                    where: { id: it.id },
                    data: {
                        title: it.title,
                        content: it.content,
                        duration: it.duration,
                    }
                })
            ),

            ...(toDeleteIds.length
                ? [
                    db.lessonPracticeItem.deleteMany({
                        where: { id: { in: toDeleteIds } },
                    }),
                ]
                : []),
        ])
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'An unexpected server error occurred while attempting to manage the lesson practice.' }, { status: 500 });
    }

    return NextResponse.json({ message: "Lesson practice updated successfully!" }, { status: 200 });
}
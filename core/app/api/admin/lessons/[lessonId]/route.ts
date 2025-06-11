import { deleteLesson, getLessonById } from "@/app/service/learning/lessons/lessonService";
import { isValidAdminSession } from "@/security/Security";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ lessonId: string }> }): Promise<NextResponse> {
    console.log(request);
    
    if (!await isValidAdminSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const lessonId = (await params).lessonId;

    if (!lessonId) {
        return NextResponse.json({ success: false, message: 'The lesson ID cannot be empty!' }, { status: 400 });
    }

    const lessonData = await getLessonById(lessonId); 

    if (!lessonData) {
        return NextResponse.json({
            success: false, message: `Unable to retrieve lesson data.
             Maybe it was removed or you do not have access to it anymore.`}, { status: 404 });
    }

    try {
        const deletionSucceeded: boolean = await deleteLesson(lessonId);

        if (deletionSucceeded) {
            return NextResponse.json({
                success: true, message: `Lesson '${lessonData.title}' was deleted successfully!`
            }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: 'Unable to delete lesson due to an internal server error!' }, { status: 500 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Unable to delete lesson due to an internal server error!' }, { status: 500 });
    }
}
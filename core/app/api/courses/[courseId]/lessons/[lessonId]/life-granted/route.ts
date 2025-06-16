import { getCourseByIdUser } from "@/app/service/learning/course/courseService";
import { getLessonById } from "@/app/service/learning/lessons/lessonService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security"
import { CourseDto, LessonDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, params: { courseId: string, lessonId: string }): Promise<NextResponse> {
    const userId: string | null = await getCurrentlyLoggedInUserIdApiRoute();

    console.log(request);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }

    if (!params.courseId) {
        return NextResponse.json({ message: 'The course ID cannot be empty!' }, { status: 400 });
    }

    if (!params.lessonId) {
        return NextResponse.json({ message: 'The lesson ID cannot be empty!' }, { status: 400 });
    }

    const course: CourseDto | undefined = await getCourseByIdUser(params.courseId);

    if (!course) {
        return NextResponse.json({ message: 'The specified course cannot be found or it is unnaccessible!' }, { status: 404 });
    }

    const lesson: LessonDto | null = await getLessonById(params.lessonId);

    if (!lesson) {
        return NextResponse.json({ message: 'The specified lesson cannot be found or it is unnaccessible!' }, { status: 404 });
    }

    const progress: { wasLifeGranted: boolean } | null = await db.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId,
                lessonId: params.lessonId
            }
        },
        select: {
            wasLifeGranted: true
        }
    });

    return NextResponse.json({ wasLifeGranted: progress?.wasLifeGranted ?? false });

}
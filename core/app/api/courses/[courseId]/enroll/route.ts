import { getCourseByIdUser } from "@/app/service/learning/course/courseService";
import { enrollmentExists, enrollToCourse } from "@/app/service/learning/course/enrollmentService";
import { initializeLessonProgressOnEnroll } from "@/app/service/learning/lessons/lessonProgressService";
import { initializeUnitProgressOnEnroll } from "@/app/service/learning/units/unitProgressService";
import { isValidSession } from "@/security/Security";
import { CourseDto } from "@/types/types";
import { LessonProgress, UnitProgress } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ courseId: string }>} 
): Promise<NextResponse> {

    if (!await isValidSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const courseId = (await (params)).courseId;

    if (!courseId) {
        return NextResponse.json({ success: false, message: 'The course ID cannot be empty!' }, { status: 400 });
    }

    const existingCourse: CourseDto | undefined = await getCourseByIdUser(courseId);

    if (!existingCourse) {
        return NextResponse.json({ success: false, message: 'Unable to enroll to this course. Maybe it was removed or you do not have access to it anymore.' },
            { status: 404 });
    }

    const alreadyEnrolled: boolean = await enrollmentExists(courseId);

    if (alreadyEnrolled) {
        return NextResponse.json({ success: false, message: 'Cannot enroll to this course since you are enrolled already!' }, { status: 409 });
    }

    const enrollment = await enrollToCourse(courseId);

    if (enrollment) {
        try {
            const unitProgress: UnitProgress | null = await initializeUnitProgressOnEnroll(enrollment.courseId);

            if (!unitProgress) throw new Error('Unit progress init failed.');

            const lessonProgress: LessonProgress | null = await initializeLessonProgressOnEnroll(unitProgress.unitId);

            if (!lessonProgress) throw new Error('Lesson progress init failed.');

            return NextResponse.json({ success: true, message: `You've successfully enrolled in '${existingCourse.name}' course!` }, { status: 201 });
        } catch (err) {
            console.error("Enrollment progress error:", err);
            return NextResponse.json({ success: false, message: 'An unexpected error occurred while setting up your learning progress.' }, { status: 500 });
        }
    }

    return NextResponse.json({ success: false, message: 'An unexpected internal server error occurred while attempting to enroll you.' }, { status: 500 });
}

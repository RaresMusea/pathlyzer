import { getCourseById } from "@/app/service/course/courseService";
import { enrollmentExists, enrollToCourse } from "@/app/service/course/enrollmentService";
import { isValidSession } from "@/security/Security";
import { CourseDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!await isValidSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const body = await request.json();
    const courseId = body.courseId;

    if (!courseId) {
        return NextResponse.json({ success: false, message: 'The course ID cannot be empty!' }, { status: 400 });
    }

    const existingCourse: CourseDto | undefined = await getCourseById(courseId);

    if (!existingCourse) {
        return NextResponse.json({ success: false, message: 'Unable to enroll to this course. Maybe it was removed or you do not have access to it anymore.' },
            { status: 404 });
    }

    const alreadyEnrolled: boolean = await enrollmentExists(courseId);

    if (alreadyEnrolled) {
        return NextResponse.json({ success: false, message: 'Cannot enroll to this course since you are enrolled already!' }, { status: 200 });
    }

    const enrollment = await enrollToCourse(courseId);

    if (enrollment) {
        return NextResponse.json({ success: true, message: `You've successfully enrolled in '${existingCourse.name}' course!` }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: 'An unexpected internal server error occurred while attempting to enroll you.' }, { status: 500 });
}
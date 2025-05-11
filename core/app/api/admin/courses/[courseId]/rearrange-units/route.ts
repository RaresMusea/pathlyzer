import { getCourseById } from "@/app/service/learning/course/courseService";
import { rearrangeUnits } from "@/app/service/learning/units/unitService";
import { isValidAdminSession } from "@/security/Security";
import { CourseDto, UnitRearrangementDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ courseId: string }> }): Promise<NextResponse> {
    if (!await isValidAdminSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const courseId = (await params).courseId;
    console.log("Course ID", courseId)

    if (!courseId) {
        return NextResponse.json({ success: false, message: 'The course ID cannot be empty!' }, { status: 400 });
    }

    const course: CourseDto | undefined = await getCourseById(courseId);
    console.log("Course", course?.name);


    if (!course) {
        return NextResponse.json({
            success: false, message: `Unable to retrieve course data for this course.
             Maybe it was removed or you do not have access to it anymore.`}, {status: 404});
    }

    try {
        const body = await request.json();
        const units: UnitRearrangementDto[] = body.units;
        console.log('Units', units);

        if (!Array.isArray(units)) {
            return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
        }

        await rearrangeUnits(units);

        return NextResponse.json({ success: true, message: 'Units were successfully rearranged!' });
    } catch (error) {
        console.log('A prins eroarea');
        console.error("Error while rearranging units:", error);
        return NextResponse.json({ success: false, message: "Unable to rearrange the course units due to an internal server error!" });
    }
}
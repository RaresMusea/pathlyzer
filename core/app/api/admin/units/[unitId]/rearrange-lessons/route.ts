import { rearrangeLessons } from "@/app/service/learning/lessons/lessonService";
import { getLessonsByUnitId } from "@/app/service/learning/units/unitService";
import { isValidAdminSession } from "@/security/Security";
import { BasicLessonDto, LessonDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ unitId: string }> }): Promise<NextResponse> {
    if (!await isValidAdminSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const unitId = (await params).unitId;

    if (!unitId) {
        return NextResponse.json({ success: false, message: 'The unit ID cannot be empty!' }, { status: 400 });
    }

    const dbLessons: BasicLessonDto[] | null = await getLessonsByUnitId(unitId);

    if (!dbLessons || dbLessons.length === 0) {
        return NextResponse.json({
            success: false, message: `Unable to retrieve lessons data for this unit.
             Maybe it was removed or you do not have access to it anymore.`}, {status: 404});
    }

    try {
        const body = await request.json();
        const reqLessons: LessonDto[] = body.lessons;

        if (!Array.isArray(reqLessons)) {
            return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
        }

        if (dbLessons.length !== reqLessons.length) {
            return NextResponse.json({ success: false, message: "Inconsistency between lessons available and lessons sent!" }, { status: 500 });
        }

        await rearrangeLessons(reqLessons);

        return NextResponse.json({ success: true, message: 'Lessons were successfully rearranged!' });
    } catch (error) {
        console.error("Error while rearranging units:", error);
        return NextResponse.json({ success: false, message: "Unable to rearrange the lessons due to an internal server error!" });
    }
}
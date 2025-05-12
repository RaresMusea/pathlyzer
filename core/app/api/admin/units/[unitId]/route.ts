import { deleteUnit, getSummarizedUnitDataById } from "@/app/service/learning/units/unitService";
import { isValidAdminSession } from "@/security/Security";
import { UnitMutationDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ unitId: string }> }): Promise<NextResponse> {
    console.log(request);
    
    if (!await isValidAdminSession()) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const unitId = (await params).unitId;

    if (!unitId) {
        return NextResponse.json({ success: false, message: 'The unit ID cannot be empty!' }, { status: 400 });
    }

    const unitData: UnitMutationDto | null = await getSummarizedUnitDataById(unitId);

    if (!unitData) {
        return NextResponse.json({
            success: false, message: `Unable to retrieve unit data.
             Maybe it was removed or you do not have access to it anymore.`}, { status: 404 });
    }

    try {
        const deletionSucceeded: boolean = await deleteUnit(unitId);

        if (deletionSucceeded) {
            return NextResponse.json({
                success: true, message: `Unit '${unitData.name}' was deleted successfully!`
            }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: 'Unable to delete unit due to an internal server error!' }, { status: 500 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'Unable to delete unit due to an internal server error!' }, { status: 500 });
    }
}
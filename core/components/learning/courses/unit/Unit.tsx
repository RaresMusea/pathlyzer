"use client";

import { CourseUnitDto } from "@/types/types";
import { UnitBanner } from "./UnitBanner";

export const Unit = ({ unit }: { unit: CourseUnitDto }) => {
    return (
        <>
        <UnitBanner title={unit.name} description={unit.description} />
        </>
    );
}
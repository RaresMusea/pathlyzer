"use client";

import { CourseUnitDto, LearningPathItem, UserCourseUnitDto } from "@/types/types";
import { UnitBanner } from "./UnitBanner";

export const Unit = ({ item }: { item: LearningPathItem }) => {
    const unit = item.unit
    return (
        <>
        <UnitBanner title={unit.name} description={unit.description} isCurrent={item.isCurrent} isCompleted={item.isCompleted} />
        </>
    );
}
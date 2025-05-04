"use client";

import { CourseUnitDto, LearningPathItem, UserCourseUnitDto } from "@/types/types";
import { UnitBanner } from "./UnitBanner";
import { Lesson } from "../lesson/Lesson";

export const Unit = ({ item }: { item: LearningPathItem }) => {
    const unit = item.unit;

    return (
        <>
            <UnitBanner title={unit.name} description={unit.description} isCurrent={item.isCurrent} isCompleted={item.isCompleted} />
            <div className="flex items-center flex-col relative">
                {
                    unit.lessons.map((lesson, index) => (
                        <Lesson key={lesson.lessonInfo.id} {...lesson} index={index} totalAmount={unit.lessons.length - 1} />
                    ))
                }
            </div>
        </>
    );
}
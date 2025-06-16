"use client"

import { CourseUnitDto } from "@/types/types";
import { AdminUnitBanner } from "./AdmitUnitBanner";
import { AdminLesson } from "../lesson/AdminLesson";

export const AdminUnit = ({ unit, courseId }: { unit: CourseUnitDto, courseId: string }) => {
    return (
        <>
            <AdminUnitBanner title={unit.name} description={unit.description} unitId={unit.id} lessons={unit.lessons} />
            <div className="flex items-center flex-col relative">
                {
                    unit.lessons.map((lesson, index) => (
                        <AdminLesson key={lesson.id} lesson={lesson} index={index} courseId={courseId} />
                    ))
                }
            </div>
        </>
    );
}
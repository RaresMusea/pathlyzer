"use client"

import { CourseUnitDto } from "@/types/types";
import { AdminUnitBanner } from "./AdmitUnitBanner";
import { AdminLesson } from "../lesson/AdminLesson";

export const AdminUnit = ({ unit }: { unit: CourseUnitDto }) => {
    return (
        <>
            <AdminUnitBanner title={unit.name} description={unit.description} unitId={unit.id} />
            <div className="flex items-center flex-col relative">
                {
                    unit.lessons.map((lesson, index) => (
                        <AdminLesson key={lesson.id} lesson={lesson} index={index} totalAmount={unit.lessons.length - 1} />
                    ))
                }
            </div>
        </>
    );
}
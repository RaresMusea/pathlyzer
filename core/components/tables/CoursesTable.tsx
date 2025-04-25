"use client";

import { useAdminCourses } from "@/hooks/useAdminCourses";
import { CourseDto } from "@/types/types";

interface CoursesTableProps {
    initialCourses: CourseDto[]
}

export const CoursesTable = ({ initialCourses }: CoursesTableProps) => {

    const { courses } = useAdminCourses(initialCourses);

    return (
        <div></div>
    );
}
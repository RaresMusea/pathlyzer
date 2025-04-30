"use client";

import { CourseDto, EnrollmentRetrievalDto } from "@/types/types";
import { CourseCard } from "./course-card/CourseCard";
import { useState } from "react";
import { EnrollmentModal } from "../enrollment/EnrollmentModal";

type CoursesWrapperProps = {
    courses: CourseDto[];
    userEnrollments: EnrollmentRetrievalDto[];
}

export const CoursesWrapper = ({ courses, userEnrollments }: CoursesWrapperProps) => {
    const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);

    const closeEnrollmentModal = () => {
        setSelectedCourse(null);
    }

    return (
        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available courses</h1>
                <div className="flex items-center gap-2">
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div key={course.id}>
                        <CourseCard course={course} setSelectedCourse={setSelectedCourse} enrollment={userEnrollments.find(e => e.courseId === course.id)} />
                    </div>
                ))}
            </div>
            <>
            <EnrollmentModal courseId={selectedCourse? selectedCourse.id : null}
                             courseTitle={selectedCourse? selectedCourse.name : null}
                             open={selectedCourse !== null} setOpen={closeEnrollmentModal} action={() => {}} />
            </>
        </div>
    )
}
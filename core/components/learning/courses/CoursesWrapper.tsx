"use client";

import { CourseDto, EnrollmentRetrievalDto } from "@/types/types";
import { CourseCard } from "./course-card/CourseCard";
import { useEffect, useState, useTransition } from "react";
import { EnrollmentModal } from "../enrollment/EnrollmentModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGamification } from "@/context/GamificationContext";

type CoursesWrapperProps = {
    courses: CourseDto[];
    userEnrollments: EnrollmentRetrievalDto[];
}

export const CoursesWrapper = ({ courses, userEnrollments }: CoursesWrapperProps) => {
    const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);
    const [isTransitioning, startTransition] = useTransition();
    const router = useRouter();
    const {lives, xp} = useGamification();
    console.log(lives, xp);

    const closeEnrollmentModal = () => {
        setSelectedCourse(null);
    }

    useEffect(() => {
        router.refresh();
    }, []);

    const submitEnrollment = async () => {
        if (selectedCourse && selectedCourse.id) {
            startTransition(async () => {
                try {
                    const courseId = selectedCourse.id;
                    const response = await axios.post(`/api/courses/${courseId}/enroll`);

                    if (response.status === 201) {
                        toast.success(response.data.message);
                        closeEnrollmentModal();
                        setTimeout(() => router.refresh(), 100);
                    }
                    else {
                        toast.error(response.data.message);
                    }
                } catch (error) {

                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data?.message || "Unexpected error during enrollment.");
                    } else {
                        toast.error("Unexpected error occurred.");
                    }
                    console.error(error);
                }
            });
        }
    }

    return (
        <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available courses</h1>
                <div className="flex items-center gap-2">
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-3 2xl:gap-2">
                {courses.map((course) => (
                    <div key={course.id}>
                        <CourseCard course={course} setSelectedCourse={setSelectedCourse} enrollment={userEnrollments.find(e => e.courseId === course.id)} />
                    </div>
                ))}
            </div>
            <>
                <EnrollmentModal courseId={selectedCourse ? selectedCourse.id : null}
                    courseTitle={selectedCourse ? selectedCourse.name : null} pending={isTransitioning}
                    open={selectedCourse !== null} setOpen={closeEnrollmentModal} action={submitEnrollment} />
            </>
        </div>
    )
}
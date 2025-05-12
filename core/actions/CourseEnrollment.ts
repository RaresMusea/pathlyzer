"use server";

import { enrollmentExists, enrollToCourse } from "@/app/service/learning/course/enrollmentService";
import { LOGIN_PAGE } from "@/routes";
import { isValidSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { handleError, handleSuccess, ServerActionResult } from "./globals/Generics";
import { getCourseById } from "@/app/service/learning/course/courseService";
import { CourseDto } from "@/types/types";


export const enroll = async (courseId: string): Promise<ServerActionResult> => {
    if (! await isValidSession()) {
        redirect(LOGIN_PAGE);
    }

    if (!courseId) {
        throw new Error("The course ID cannot be null or empty!");
    }

    const existingCourse: CourseDto | undefined = await getCourseById(courseId);

    if (!existingCourse) {
        return handleError('Unable to enroll to this course. Maybe it was removed or you do not have access to it anymore.');
    }

    const alreadyEnrolled: boolean = await enrollmentExists(courseId);

    if (alreadyEnrolled) {
        return handleError('Cannot enroll to this course since you are enrolled already!');
    }

    const enrollment = await enrollToCourse(courseId);

    return (enrollment ? handleSuccess(`You've successfully enrolled in '${existingCourse.name}' course!`)
        : handleError('An unexpected internal server error occurred while attempting to enroll you.'));
}
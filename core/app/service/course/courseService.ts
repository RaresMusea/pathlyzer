import { fromCourseDto, fromCoursesToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT, LOGIN_PAGE, UNAUTHORIZED_REDIRECT } from "@/routes";
import { isValidAdminSession, isValidSession } from "@/security/Security";
import { CourseDto } from "@/types/types";
import { Course, CourseTag } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCourseTags(): Promise<CourseTag[]> {
    const tags: CourseTag[] = await db.courseTag.findMany();

    return tags;
}

export const courseAlreadyExists = async (courseName: string): Promise<boolean> => {
    const course = await db.course.findUnique({ where: { name: courseName } });
    return Boolean(course);
}

export const courseExists = async (courseId: string): Promise<boolean> => {
    const course = await db.course.findUnique({ where: { id: courseId } });

    return Boolean(course);
}

export const getAvailableCourses = async (): Promise<CourseDto[]> => {
    if (!await isValidSession()) {
        redirect(LOGIN_PAGE);
    }
    const courses: (Course & { tags: CourseTag[] })[] = await db.course.findMany({ where: { available: true }, include: { tags: true } });

    return fromCoursesToDto(courses)

}

export const getCourseById = async (courseId: string): Promise<CourseDto | undefined> => {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }
    const requestedCourse = await db.course.findUnique({ where: { id: courseId }, include: { tags: true } });

    if (!requestedCourse) {
        return undefined;
    }

    return fromCourseDto(requestedCourse);
}

export const courseWithIdAlreadyExists = async (courseId: string): Promise<boolean> => {
    if (!(await isValidAdminSession())) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const requestedId = await db.course.findUnique({
        where: { id: courseId },
        select: { id: true },
    });

    return !!requestedId;
}
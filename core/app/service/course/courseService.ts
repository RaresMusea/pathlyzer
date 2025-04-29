import { fromCourseDto, fromCoursesToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { isValidAdminSession } from "@/security/Security";
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

export const getCourses = async (): Promise<CourseDto[]> => {
    if (!await isValidAdminSession()) {
        redirect('/unauthorized');
    }
    const courses: (Course & { tags: CourseTag[] })[] = await db.course.findMany({ include: { tags: true } });

    return fromCoursesToDto(courses);
}

export const getAvailableCourses = async (): Promise<CourseDto[]> => {
    const courses: (Course & { tags: CourseTag[] })[] = await db.course.findMany({ where: { available: true }, include: { tags: true } });

    return fromCoursesToDto(courses)

}

export const getCourseById = async (courseId: string): Promise<CourseDto | undefined> => {
    if (!await isValidAdminSession()) {
        redirect('/unauthorized');
    }
    const requestedCourse = await db.course.findUnique({ where: { id: courseId }, include: { tags: true } });

    if (!requestedCourse) {
        return undefined;
    }

    return fromCourseDto(requestedCourse);
}

export const courseWithIdAlreadyExists = async (courseId: string): Promise<boolean> => {
    if (!(await isValidAdminSession())) {
        redirect('/unauthorized');
    }

    const requestedId = await db.course.findUnique({
        where: { id: courseId },
        select: { id: true },
    });

    return !!requestedId;
}
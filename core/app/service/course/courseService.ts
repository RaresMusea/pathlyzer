import { fromCoursesToDto } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { CourseDto } from "@/types/types";
import { Course, CourseTag } from "@prisma/client";

export async function getCourseTags(): Promise<CourseTag[]> {
    const tags: CourseTag[] = await db.courseTag.findMany();

    return tags;
}

export const courseAlreadyExists = async (courseName: string): Promise<boolean> => {
    const course = await db.course.findUnique({ where: { name: courseName } });
    return Boolean(course);
}

export const getCourses = async (): Promise<CourseDto[]> => {
    const courses: (Course & { tags: CourseTag[] })[] = await db.course.findMany({ include: { tags: true } });

    return fromCoursesToDto(courses);
}
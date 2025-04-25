import { CourseDto } from "@/types/types";
import { Course, CourseTag } from "@prisma/client";

export function fromCourseDto(course: Course & { tags: CourseTag[] }): CourseDto {
    return {
        id: course.id,
        name: course.name,
        imageSrc: Buffer.from(course.imageSrc).toString("base64"),
        description: course.description,
        difficulty: course.difficulty,
        available: course.available,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
        tags: course.tags.map(tag => ({
            id: tag.id,
            name: tag.name,
        }))
    }
}

export function fromCoursesToDto(courses: (Course & { tags: CourseTag[] })[]): CourseDto[] {
    return courses.map(fromCourseDto);
}
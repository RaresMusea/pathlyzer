import { Option } from "@/components/ui/multiselect";
import { CourseDto, EnrollmentRetrievalDto } from "@/types/types";
import { Course, CourseTag, Enrollment } from "@prisma/client";

export function fromCourseDto(course: Course & { tags: CourseTag[] }): CourseDto {
    return {
        id: course.id,
        name: course.name,
        imageSrc: Buffer.from(course.imageSrc).toString("utf-8"),
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

function fromCourseTagToOption(tag: CourseTag): Option {
    return {
        value: tag.id,
        label: tag.name
    }
}

export function fromCourseTagsToOptions(tags: CourseTag[]): Option[] {
    if (!tags || tags.length === 0) {
        return [];
    }

    return tags.map(fromCourseTagToOption);
}


export function fromEnrollmentToRetrievalDto(enrollment: Enrollment): EnrollmentRetrievalDto {
    return {
        courseId: enrollment.courseId,
        progress: enrollment.progress,
        lastAccessedLessonId: enrollment.lastAccessedLessonId ?? "",
    };
}

export function fromEnrollmentsToRetrievalDtoArray(enrollments: Enrollment[]): EnrollmentRetrievalDto[] {
    return enrollments.map(fromEnrollmentToRetrievalDto);
}
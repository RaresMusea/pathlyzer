import { Option } from "@/components/ui/multiselect";
import { CourseDto, CourseUnitDto, EnrollmentRetrievalDto, LessonDto, UserStatsDto } from "@/types/types";
import { Course, CourseTag, Enrollment, Unit, UserStats } from "@prisma/client";

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

export function fromUserStatsToDto(stats: UserStats): UserStatsDto {
    return {
        id: stats.id,
        lives: stats.lives,
        xp: stats.xp,
        level: stats.level
    };
}

export function fromUnitToDto(unit: Unit, lessonsDtos: LessonDto[]): CourseUnitDto {
    const courseUnitDto: CourseUnitDto = {
        id: unit.id,
        name: unit.name,
        description: unit.description,
        order: unit.order,
        lessons: lessonsDtos.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
        })),
    };

    return courseUnitDto;
}
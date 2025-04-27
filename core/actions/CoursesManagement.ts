"use server";

import { courseAlreadyExists } from "@/app/service/course/courseService";
import { db } from "@/persistency/Db";
import { CourseMutationSchema } from "@/schemas/CourseMutationValidation";
import { CourseTag } from "@prisma/client";
import * as z from "zod";

export interface CourseManagementResult {
    isValid: boolean;
    message?: string;
}

const getOrCreateExistingTags = async (tags: CourseTag[]): Promise<CourseTag[]> => {
    const existingTags = await Promise.all(
        tags.map(async (t) => {
            const tag = await db.courseTag.upsert({
                where: { name: t.name },
                update: {},
                create: { name: t.name },
            });
            return tag;
        })
    );

    return existingTags;
}

const handleError = (message: string = 'An unexpected server error occurred. Please try again later.'): CourseManagementResult => {
    return {
        isValid: false,
        message
    };
}

const handleSuccess = (message: string): CourseManagementResult => {
    return {
        isValid: true,
        message
    }
}

export const saveCourse = async (values: z.infer<typeof CourseMutationSchema>): Promise<CourseManagementResult> => {
    const validatedFields = CourseMutationSchema.safeParse(values);

    if (!validatedFields.success) {
        handleError(validatedFields.error.message);
    }

    const { name, description, image, difficulty, availability, tags } = values;

    if (await courseAlreadyExists(name)) {
        return handleError(`Unable to create course '${name}', because a course with a same name already exists!`);
    }

    const existingTags: CourseTag[] = await getOrCreateExistingTags(tags);

    try {
        const newCourse = await db.course.create({
            data: {
                name,
                description,
                imageSrc: new TextEncoder().encode(image),
                difficulty,
                available: availability,
                tags: {
                    connect: existingTags.map(tag => ({ id: tag.id }))
                }
            }
        });

        if (newCourse) {
            return handleSuccess('Course created successfully!');
        }

        handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    }
    catch (error) {
        console.error(error);
        return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    }
    
    return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
}
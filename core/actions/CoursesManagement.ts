"use server";

import { courseAlreadyExists, courseWithIdAlreadyExists } from "@/app/service/course/courseService";
import { db } from "@/persistency/Db";
import { CourseMutationSchema } from "@/schemas/CourseMutationValidation";
import { isValidAdminSession } from "@/security/Security";
import { CourseTag } from "@prisma/client";
import { redirect } from "next/navigation";
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

const validate = async (values: z.infer<typeof CourseMutationSchema>) => {
    if (await !isValidAdminSession()) {
        redirect('/unauthorized');
    }

    const validatedFields = CourseMutationSchema.safeParse(values);

    if (!validatedFields.success) {
        handleError(validatedFields.error.message);
    }
}

const validateUpdate = async (values: z.infer<typeof CourseMutationSchema>, courseId: string | undefined) => {
    await validate(values);

    console.log("Image", values.image);

    if (!courseId) {
        handleError('Cannot update course due to unknown identifier!');
    }

    if (!await courseWithIdAlreadyExists(courseId as string)) {
        handleError('The course ID cannot be modified!');
    }
}

export const saveCourse = async (values: z.infer<typeof CourseMutationSchema>): Promise<CourseManagementResult> => {
    await validate(values);

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

        return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    }
    catch (error) {
        console.error(error);
        return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    }
}

export const updateCourse = async (courseId: string | undefined, values: z.infer<typeof CourseMutationSchema>): Promise<CourseManagementResult> => {
    await validateUpdate(values, courseId)
    const { name, description, image, difficulty, availability, tags } = values;
    const existingTags: CourseTag[] = await getOrCreateExistingTags(tags);

    try {
        const updatedCourse = await db.course.update({
            where: { id: courseId },
            data: {
                name,
                description,
                imageSrc: new TextEncoder().encode(image),
                available: availability,
                difficulty,
                tags: {
                    connect: existingTags.map(tag => ({ id: tag.id }))
                },
            },
        });

        if (updatedCourse) {
            return handleSuccess('Course updated successfully!');
        }
        return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    } catch (error) {
        return handleError('An unexpected error occurred while attempting to create the course. Please try again later.');
    }
}
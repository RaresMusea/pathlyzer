"use server";

import { UnitMutationValidator } from "@/schemas/UnitMutationValidation";
import { z } from "zod";
import { handleError, handleSuccess, ServerActionResult } from "./globals/Generics";
import { isValidAdminSession } from "@/security/Security";
import { redirect } from "next/navigation";
import { UNAUTHORIZED_REDIRECT } from "@/routes";
import { addUnit } from "@/app/service/learning/units/unitService";

async function validate(values: z.infer<typeof UnitMutationValidator>) {
    if (!await isValidAdminSession()) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    const validatedFields = UnitMutationValidator.safeParse(values);

    if (!validatedFields.success) {
        handleError(validatedFields.error.message);
    }
}

export async function saveUnit(values: z.infer<typeof UnitMutationValidator>, courseId: string): Promise<ServerActionResult> {
    await validate(values);

    if (!courseId) {
        return handleError('The course ID cannot be empty!');
    }

    try {
        const createdUnit = await addUnit({ name: values.name, description: values.description }, courseId);

        if (createdUnit) {
            return handleSuccess('Unit created successfully!');
        }

        return handleError('An unexpected error occurred while attempting to create the unit. Please try again later.');
    } catch (error) {
        console.error(error);
        return handleError('An unexpected error occurred while attempting to create the unit. Please try again later.');
    }
}
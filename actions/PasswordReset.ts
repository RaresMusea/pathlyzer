"use server";

import * as z from "zod";
import { PasswordResetSchema } from "@/schemas/AuthValidation";
import { getUserByEmail } from "@/persistency/data/User";
import { generatePasswordResetToken } from "@/lib/TokenGenerator";
import { sendPasswordResetEmail } from "@/lib/Email";

export interface PasswordResetResult {
    error?: string;
    success?: string;
};

export const resetPassword = async (values: z.infer<typeof PasswordResetSchema>): Promise<PasswordResetResult | undefined> => {
    const validatedFields = PasswordResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid email!"
        };
    }

    const { email } = validatedFields.data;
    const user = await getUserByEmail(email);

    if (!user) {
        return {
            error: "User not found!"
        };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token, user.name!);

    return {
        success: `A password reset email has been sent to ${email}.`
    };
};

"use server";

import { getPasswordResetToken } from "@/persistency/data/PasswordReset";
import { ChangePasswordSchema } from "@/schemas/AuthValidation";
import * as z from "zod";
import bcrypt from "bcryptjs"
import { verifyUser } from "./globals/Generics";
import { db } from "@/persistency/Db";

//TODO: Find a way to make this generic
const verifyToken = async (token: string) => {
    const existingToken = await getPasswordResetToken(token);

    if (!existingToken) {
        return {
            error: "The password already been changed or the verification link is invalid."
        };
    }

    if (new Date() > existingToken.expiresAt) {
        return {
            error: "The token has expired!"
        };
    }

    return { token: existingToken };
};

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>, token?: string | null) => {
    if (!token) {
        console.log("Missing token!");
        return {
            error: "The token is missing!"
        };
    }

    const validateFields = ChangePasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return {
            error: "Invalid fields!"
        };
    }

    const { password } = validateFields.data;
    const tokenResult = await verifyToken(token);

    if ('error' in tokenResult) {
        return tokenResult;
    }

    const userResult = await verifyUser(tokenResult.token.email);

    if ('error' in userResult) {
        return userResult;
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: userResult.user.id
        },
        data: {
            password: hashedPass,
        }
    });

    await db.passwordResetToken.delete({
        where: { id: tokenResult.token.id }
    });

    return {
        success: "Password changed! Redirecting you to the login page..."
    };
};
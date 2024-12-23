"use server";

import { LoginSchema } from '@/schemas/AuthValidation';
import * as z from 'zod'
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { generateEmailVerifToken } from '@/lib/TokenGenerator';
import { getUserByEmail } from '@/persistency/data/User';

export interface LoginResult {
    error?: string;
    success?: string;
}

const valudateFields = (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields!"
        };
    }

    return { data: validatedFields.data };
};

const checkForExistingUser = async (email: string) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {
            error: "Email does not exist!"
        }
    }

    return { user: existingUser };
};

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResult | undefined> => {
    const validationResult = valudateFields(values);

    if ('error' in validationResult) {
        return validationResult;
    }

    const { email, password } = validationResult.data;
    const userCheck = await checkForExistingUser(email);

    if ('error' in userCheck) {
        return userCheck;
    }

    const existingUser = userCheck.user;

    if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerifToken(existingUser.email!);
        return {
            success: `A verification email was successfully sent to ${existingUser.email}!`
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof AuthError) {
            return {
                error: error.type === "CredentialsSignin" ? "Invalid login credentials!" : "An error occurred while attempting to sign you in."
            }
        }

        throw error;
    }
};
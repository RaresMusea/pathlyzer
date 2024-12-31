"use server";

import { LoginSchema } from '@/schemas/AuthValidation';
import * as z from 'zod'
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { generateEmailVerifToken } from '@/lib/TokenGenerator';
import { getUserByEmail } from '@/persistency/data/User';
import { sendVerificationEmail, send2FATokenEmail } from '@/lib/Email';
import { generate2FAToken } from '@/lib/TokenGenerator';
import { TwoFactorConfirmation, TwoFactorToken } from '@prisma/client';
import { getTokenByEmail } from '@/persistency/data/2FAToken';
import { db } from '@/persistency/Db';
import { getTwoFactorConfirmationByUserId } from '@/persistency/data/2FAConfirmation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export interface LoginResult {
    error?: string;
    success?: string;
    twoFactor?: string;
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

const handleEmailVerify = async (user: {email: string; name?: string}) => {
    const verifyToken = await generateEmailVerifToken(user.email);
    await sendVerificationEmail(verifyToken.email, verifyToken.token, user.name || "User");

    return {
        success: `A verification email was successfully sent to ${user.email}!`,
    };
};

const handleTwoFactorAuth = async (user: {id: string; email: string; name?: string}, providedOtp?: string) => {
    if (providedOtp) {
        const twoFactorToken = await getTokenByEmail(user.email);
        
        if (!twoFactorToken) {
            return { error: 'The provided OTP code is invalid!' };
        }

        if (twoFactorToken.token !== providedOtp) {
            return { error: "Invalid or already used OTP code!" };
        }

        const tokenHasExpired: boolean = new Date(twoFactorToken.expiresAt) < new Date();

        if (tokenHasExpired) {
            return { error: "The OTP code has expired! "};
        }

        await db.twoFactorToken.delete({ where: { id: twoFactorToken.id }});
        const existingConfirmationToken = await getTwoFactorConfirmationByUserId(user.id);

        if (existingConfirmationToken) {
            await db.twoFactorConfirmation.delete({ where: { id: existingConfirmationToken.id }});
        }
        await db.twoFactorConfirmation.create({ data: { userId: user.id }});
    }
    else {
        const generatedOtp = await generate2FAToken(user.email);
        await send2FATokenEmail(generatedOtp.email, generatedOtp.token, user.name!);
        return { twoFactor: generatedOtp.token};
    }
};

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResult | undefined> => {
    const validationResult = valudateFields(values);

    if ('error' in validationResult) {
        return validationResult;
    }

    const { email, password, twoFactorOtp } = validationResult.data;
    const userCheck = await checkForExistingUser(email);

    if ('error' in userCheck) {
        return userCheck;
    }

    const existingUser = userCheck.user;

    if (!existingUser.emailVerified) {
        if (existingUser.email) {
            return await handleEmailVerify({ email: existingUser.email, name: existingUser.name || undefined });
        } else {
            return { error: "User email is invalid!" };
        }
    }

    if (existingUser.is2FAEnabled && existingUser.email) {
       const twoFactorResult = await handleTwoFactorAuth({ id: existingUser.id, email: existingUser.email, name: existingUser.name || undefined }, twoFactorOtp);
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

        if (isRedirectError(error)) {
            throw error;
        }

        throw error;
    }
};
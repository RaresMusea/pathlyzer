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

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResult | undefined> => {
    const validationResult = valudateFields(values);

    if ('error' in validationResult) {
        return validationResult;
    }

    const { email, password, twoFactorOtp } = validationResult.data;
    console.log(validationResult.data);
    const userCheck = await checkForExistingUser(email);

    if ('error' in userCheck) {
        return userCheck;
    }

    const existingUser = userCheck.user;

    if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerifToken(existingUser.email!);
        await sendVerificationEmail(verificationToken.email, verificationToken.token, existingUser.name!);

        return {
            success: `A verification email was successfully sent to ${existingUser.email}!`
        }
    }

    if (existingUser.is2FAEnabled && existingUser.email) {
        if (twoFactorOtp) {
            const twoFactorToken = await getTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: 'The provided OTP code is invalid!' };
            }

            if (twoFactorToken.token !== twoFactorOtp) {
                return { error: "Invalid OTP code!" };
            }

            const tokenExpired: boolean = new Date(twoFactorToken.expiresAt) < new Date();
            
            if (tokenExpired) {
                return { error: "The OTP code has expired!" };
            }

            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            });

            const existingConfirmationToken = await getTwoFactorConfirmationByUserId(existingUser.id);

            if (existingConfirmationToken) {
                await db.twoFactorConfirmation.delete({
                    where: {id: existingConfirmationToken.id}
                });
            }
            
            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            });
        }
        else {
            const generatedTwoFactorOtp: TwoFactorToken = await generate2FAToken(existingUser.email);
            await send2FATokenEmail(generatedTwoFactorOtp.email, generatedTwoFactorOtp.token, existingUser.name);

            return { twoFactor: generatedTwoFactorOtp.token }
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
"use server";

import { db } from "@/persistency/Db";
import { getVerificationByToken } from "@/persistency/data/EmailVerification";
import { verifyUser } from "./globals/Generics";

export const verifiyEmail = async (token: string) => {
    const tokenResult = await verifyToken(token);

    if ('error' in tokenResult) {
        return tokenResult;
    }

    const userResult = await verifyUser(tokenResult.token.email);

    if('error' in userResult) {
        return userResult;
    }

    await db.user.update({
        where: {
            id: userResult.user.id
        },
        data: {
            emailVerified: new Date(),
            email: userResult.user.email,
        }
    });

    await db.verificationToken.delete({
        where: { id: tokenResult.token.id }
    });

    return {
        success: "Email verified successfully!"
    };
};

const verifyToken = async (token: string) => {
    const existingToken = await getVerificationByToken(token);

    if (!existingToken) {
        return { 
            error: "This email address has already been verified or the verification link is invalid." 
        };
    }

    if (new Date() > existingToken.expiresAt) {
        return {
            error: "The token has expired!"
        };
    }

    return { token: existingToken };
};

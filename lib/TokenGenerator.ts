import { getVerifTokenByEmail } from "@/persistency/data/EmailVerification";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/persistency/Db";
import { getPasswordResetTokenByEmail } from "@/persistency/data/PasswordReset";
import crypto from "crypto";
import { getTokenByEmail } from "@/persistency/data/2FAToken";
import { TwoFactorToken } from "@prisma/client";

export const generateEmailVerifToken = async (email: string) => {
    const token: string = uuidv4();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    const existingToken = await getVerifTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete(
            {
                where: {
                    id: existingToken.id
                }
            }
        )
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expiresAt: expires
        }
    });

    return verificationToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token: string = uuidv4();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete(
            {
                where: {
                    id: existingToken.id
                }
            }
        )
    }

    const verificationToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt: expires
        }
    });

    return verificationToken;
};

export const generate2FAToken = async (email: string): Promise<TwoFactorToken> => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

    const existingToken = await getTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: { id: existingToken.id }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expiresAt: expires
        }
    });

    return twoFactorToken;
};
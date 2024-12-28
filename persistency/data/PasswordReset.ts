import { db } from "../Db";

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: { email }
        });

        return passwordResetToken;
    }
    catch (e) {
        console.error(e);
    }
};

export const getPasswordResetToken = async (token: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: { token }
        });

        return passwordResetToken;
    }
    catch (e) {
        console.error(e);
    }
};
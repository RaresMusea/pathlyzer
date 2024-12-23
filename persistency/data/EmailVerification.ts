import { db } from '../Db';

export const getVerifTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { email }
        });

        return verificationToken;
    }
    catch (e) {
        console.error(e);
    }
}

export const getVerificationByToken = async (token: string) => {
    try {
        const verificationToken = await db.verificationToken.findUnique({
            where: { token }
        });

        return verificationToken;
    }
    catch (e) {
        console.error(e);
    }
}
import { db } from "../Db";

export const getBy2FAToken = async (token: string)  => {
    try {
        const twoFactorToken = await db.twoFactoToken.findUnique({
            where: {token}
        });

        return twoFactorToken;
    }
    catch (e) {
        console.error(e);
    }
};

export const getTokenByEmail = async (email: string)  => {
    try {
        const twoFactorToken = await db.twoFactoToken.findFirst({
            where: {email}
        });

        return twoFactorToken;
    }
    catch (e) {
        console.error(e);
    }
};


import { db } from "../Db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFaConfirmation = await db.twoFactorConfirmation.findUnique(
            {
                where: { userId }
            }
        );

        return twoFaConfirmation;
    }
    catch (e) {
        console.error(e);
    }
}
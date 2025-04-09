import { getUserByEmail } from "@/persistency/data/User";

export interface GenericServerActionResult {
    success?: string;
    error?: string;
};

export const verifyUser = async (email: string) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return {
            error: "The user/email associated to this token does not exist!"
        }
    }

    return { user: existingUser };
};
import { getUserByEmail } from "@/persistency/data/User";

export interface GenericServerActionResult {
    success?: string;
    error?: string;
};

export interface ServerActionResult {
    success: boolean;
    message: string;
}

export const handleSuccess = (message: string): ServerActionResult => {
    return {
        success: true,
        message
    }
}

export const handleError = (message: string): ServerActionResult => {
    return {
        success: false,
        message
    };
}

export const verifyUser = async (email: string) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return {
            error: "The user/email associated to this token does not exist!"
        }
    }

    return { user: existingUser };
};
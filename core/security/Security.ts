"use server";

import { auth } from "@/auth";
import { LOGIN_PAGE } from "@/routes";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export const isValidSession = async (): Promise<boolean> => {
    const session = await auth();

    return !!(session && session.user);
}

export const isValidAdminSession = async (): Promise<boolean> => {
    const session = await auth();
    return await !!(session && session.user) && session?.user.role === UserRole.ADMINISTRATOR;
}

export const getCurrentlyLoggedInUserId = async (): Promise<string> => {
    const session = await auth();

    if (!session || !session.user) {
        redirect(LOGIN_PAGE);
    }

    const userId = await session.user.id;

    if (!userId) {
        throw new Error('The user ID was undefined!');
    }

    return userId;
}

export const getCurrentlyLoggedInUserIdApiRoute = async (): Promise<string | null> => {
    const session = await auth();
    return session?.user?.id ?? null;
};
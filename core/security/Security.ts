"use server";

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export const isValidSession = async (): Promise<boolean> => {
    const session = await auth();

    return !!(session && session.user);
}

export const isValidAdminSession = async (): Promise<boolean> => {
    const session = await auth();
    return await !!(session && session.user) && session?.user.role === UserRole.ADMINISTRATOR;
}
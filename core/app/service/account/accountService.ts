import { auth } from "@/auth";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getAccountAuthProvider = cache(async (): Promise<string | null> => {
    const session = await auth();

    if (!session || !session.user) {
        redirect(LOGIN_PAGE);
    }

    const userId: string | undefined = session.user.id;

    if (!userId) {
        throw new Error('The user ID cannot be undefined');
    }

    const accountAuthProvider: { provider: string } | null = await db.account.findFirst({ where: { userId: userId }, select: { provider: true } });

    return accountAuthProvider?.provider ?? null;
}); 
import { db } from "@/persistency/Db";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getCurrentlyLoggedInUserIdApiRoute, isValidSession } from "@/security/Security";
import { LearningSession } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

const DAY_MS = 86400000;

export const getLearningSession = cache(async (sessionId: string): Promise<LearningSession | null> => {
    if (!isValidSession()) {
        redirect(DEFAULT_LOGIN_REDIRECT)
    }

    const session = await db.learningSession.findUnique({ where: { id: sessionId } });

    return session ?? null;
})

export const getCurrentUserLearningDurationTotal = cache(async (): Promise<number> => {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const result = await db.learningSession.aggregate({
        where: {
            userId: currentUserId,
            endedAt: {
                not: null,
            },
            duration: {
                not: null,
                gt: 0,
            },
        },
        _sum: {
            duration: true,
        },
    });

    return result._sum.duration ?? 0;
});

export const getLongestLearningStreak = async (): Promise<number> => {
    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        redirect(DEFAULT_LOGIN_REDIRECT);
    }

    const sessions = await db.learningSession.findMany({
        where: {
            userId: currentUserId,
            endedAt: { not: null },
        },
        select: {
            startedAt: true,
        },
        orderBy: {
            startedAt: "asc",
        },
    });

    const uniqueDayStrings = new Set(
        sessions.map((s) => s.startedAt.toISOString().split("T")[0])
    );

    const uniqueDays = Array.from(uniqueDayStrings)
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    if (uniqueDays.length === 0) return 0;

    let longest = 1;
    let current = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
        const diffInMs = uniqueDays[i].getTime() - uniqueDays[i - 1].getTime();
        const diffInDays = Math.floor(diffInMs / DAY_MS);

        if (diffInDays === 1) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 1;
        }
    }

    return longest;
};

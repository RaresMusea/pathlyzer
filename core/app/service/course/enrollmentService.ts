import { auth } from "@/auth";
import { fromEnrollmentsToRetrievalDtoArray } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { Enrollment } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUserEnrollments = cache(async () => {
    const session = await auth();

    if (!session || !session.user) {
        redirect(LOGIN_PAGE);
    }

    const userId = session.user.id;

    if (!userId) {
        throw new Error("Unable to obtain user credentials. Please try again.");
    }

    const enrollments: Enrollment[] = await db.enrollment.findMany({ where: { userId } });

    return fromEnrollmentsToRetrievalDtoArray(enrollments);
});
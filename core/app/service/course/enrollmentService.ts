import { auth } from "@/auth";
import { fromEnrollmentsToRetrievalDtoArray } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { Enrollment } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

const validateEnrollmentTransaction = async (): Promise<string> => {
    const session = await auth();

    if (!session || !session.user) {
        redirect(LOGIN_PAGE);
    }

    const userId = session.user.id;

    if (!userId) {
        throw new Error("Unable to obtain user credentials. Please try again.");
    }

    return userId;
}

export const enrollmentExists = async (courseId: string): Promise<boolean> => {
    const userId = await validateEnrollmentTransaction();

    const result = await db.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: { id: true }
    });

    return Boolean(result);
};

export const getUserEnrollments = cache(async () => {
    const userId: string = await validateEnrollmentTransaction();
    const enrollments: Enrollment[] = await db.enrollment.findMany({ where: { userId } });

    return fromEnrollmentsToRetrievalDtoArray(enrollments);
});

export const enrollToCourse = cache(async (courseId: string): Promise<Enrollment | null> => {
    const userId: string = await validateEnrollmentTransaction();

    const result: Enrollment | null = await db.enrollment.create({
        data: {
            courseId,
            userId,
            lastAccessedLessonId: null,
        }
    });

    return result;
})
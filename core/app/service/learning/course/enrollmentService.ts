import { auth } from "@/auth";
import { fromEnrollmentsToRetrievalDtoArray } from "@/lib/Mapper";
import { db } from "@/persistency/Db";
import { LOGIN_PAGE } from "@/routes";
import { Enrollment } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getCompletedUnitsCount, getUnitsCount } from "../units/unitService";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";

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

export const getUserEnrollment = cache(async (courseId: string, userId: string): Promise<Enrollment | null> => {
    const currentlyLoggedInUser = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentlyLoggedInUser || !(userId === currentlyLoggedInUser)) {
        throw new Error('Unauthorized!');
    }

    const result: Enrollment | null = await db.enrollment.findFirst({ where: { courseId, userId } });

    return result ?? null;
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
});

export const updateEnrollmentProgress = async (courseId: string, userId: string): Promise<Enrollment | null> => {
    const loggedInUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!loggedInUserId || !(loggedInUserId === userId)) {
        throw new Error('Unauthorized');
    }

    const unitsAmount: number = await getUnitsCount(courseId);
    const completedUnitsAmount: number = await getCompletedUnitsCount(loggedInUserId);

    if (unitsAmount === 0) {
        throw new Error('The specified course does not contain any unit!');
    }

    const enrollment = await getUserEnrollment(courseId, userId);

    if (!enrollment) {
        throw new Error('The specified user enrollment does not exist!');
    }

    const actualEnrollmentProgress = Math.min(100, Math.round((completedUnitsAmount * 100) / unitsAmount));

    const result: Enrollment | null = await db.enrollment.update({
        where: { userId_courseId: { userId, courseId } },
        data: { progress: actualEnrollmentProgress, completed: actualEnrollmentProgress === 100 }
    });

    return result ?? null;
}
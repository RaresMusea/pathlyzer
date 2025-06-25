import { getCourseByIdUser } from "@/app/service/learning/course/courseService";
import { getCurrentUserLessonProgress } from "@/app/service/learning/lessons/lessonProgressService";
import { getLessonById } from "@/app/service/learning/lessons/lessonService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { db } from "@/persistency/Db";
import { getCurrentlyLoggedInUserIdApiRoute } from "@/security/Security";
import { CourseDto, LessonDto, UserStatsDto } from "@/types/types";
import { LessonProgress, UserCooldown } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest, { params }: { params: Promise<{ courseId: string, lessonId: string }> }): Promise<NextResponse> {
    console.log(request);

    const currentUserId = await getCurrentlyLoggedInUserIdApiRoute();

    if (!currentUserId) {
        return NextResponse.json({ message: 'Unauthorized!' }, { status: 401 });
    }

    const { courseId, lessonId } = await params;

    if (!courseId) {
        return NextResponse.json({ message: 'The course ID cannot be empty!' }, { status: 400 });
    }

    if (!lessonId) {
        return NextResponse.json({ message: 'The lesson ID cannot be empty!' }, { status: 400 });
    }

    const course: CourseDto | undefined = await getCourseByIdUser(courseId);

    if (!course) {
        return NextResponse.json({ message: 'The specified course cannot be found or it is unnaccessible!' }, { status: 404 });
    }

    const lesson: LessonDto | null = await getLessonById(lessonId);

    if (!lesson) {
        return NextResponse.json({ message: 'The specified lesson cannot be found or it is unnaccessible!' }, { status: 404 });
    }

    const currentLessonProgress: LessonProgress | null = await db.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId: currentUserId,
                lessonId: lesson.id
            }
        },
    });

    const userStats: UserStatsDto | null = await getUserStats();

    if (!userStats) {
        return NextResponse.json({ message: 'User stats not found!' }, { status: 404 });
    }

    if (!currentLessonProgress) {
        return NextResponse.json({ message: 'The lesson progress cannot be found!' }, { status: 404 });
    }

    if (currentLessonProgress.wasLifeGranted) {
        return NextResponse.json({ message: 'You have already been granted a life for this lesson!' }, { status: 400 });
    }

    const userCooldown: UserCooldown | null = await db.userCooldown.findFirst({
        where: {
            userId: currentUserId
        }
    });

    if (!userCooldown) {
        return NextResponse.json({ message: 'You do not have an active cooldown!' }, { status: 400 });
    }

    const cooldownStart: Date = userCooldown.startedAt;
    const cooldownDurationMs: number = userCooldown.durationMinutes * 60 * 1000;
    const cooldownEnd = new Date(cooldownStart.getTime() + cooldownDurationMs);
    const now = new Date();

    if (now > cooldownEnd) {
        await db.userCooldown.delete({
            where: {
                userId: currentUserId
            }
        });

        return NextResponse.json({ message: 'The cooldown has already expired!' }, { status: 400 });
    }

    try {
        await db.$transaction([
            db.lessonProgress.update({
                where: {
                    userId_lessonId: {
                        userId: currentUserId,
                        lessonId: lesson.id,
                    },
                },
                data: {
                    wasLifeGranted: true,
                },
            }),
            db.userCooldown.delete({
                where: {
                    userId: currentUserId,
                },
            }),
            db.userStats.update({
                where: {
                    userId: currentUserId,
                },
                data: {
                    lives: {
                        increment: 1,
                    },
                },
            }),
        ]);

        return NextResponse.json({ message: 'Life granted and cooldown removed!', lives: 1 }, { status: 200 });

    } catch (error) {
        console.error('Error granting life:', error);
        return NextResponse.json({ message: 'An error occurred while granting life.' }, { status: 500 });
    }
}
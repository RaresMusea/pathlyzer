import { addLessonProgress, getCurrentUserLessonProgress } from "@/app/service/learning/lessons/lessonProgressService";
import { getLessonContent } from "@/app/service/learning/lessons/lessonService";
import { getUserCooldown } from "@/app/service/user/cooldownService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { LessonContent } from "@/components/learning/courses/lesson/LessonContent";
import { PageTransition } from "@/components/misc/animations/PageTransition"; import { GamificationProvider } from "@/context/GamificationContext";
;
import { LessonContentDto, UserStatsDto } from "@/types/types";
import { UserCooldown } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function ReadLesson({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const lessonContent: LessonContentDto | null = await getLessonContent(lessonId);
    let userLearningProgress = await getCurrentUserLessonProgress(lessonId);
    const userStats: UserStatsDto | null = await getUserStats();
    const userCooldown: UserCooldown | null = await getUserCooldown();

    if (!courseId || !lessonId || !lessonContent || !userStats) {
        notFound();
    }

    if (userLearningProgress === null) {
        const result = await addLessonProgress(lessonId);

        if (!result) {
            notFound();
        }

        userLearningProgress = 0;
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 space-y-8">
                <GamificationProvider initialUserStats={userStats}>
                    <LessonContent lessonId={lessonId} lessonContent={lessonContent} userStats={userStats} userLearningProgress={userLearningProgress} userCooldownReason={userCooldown?.reason} cooldownMinutes={userCooldown?.durationMinutes} />
                </GamificationProvider>
            </div>
        </PageTransition>
    )
}
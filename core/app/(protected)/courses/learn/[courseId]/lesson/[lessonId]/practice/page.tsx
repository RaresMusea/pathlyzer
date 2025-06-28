import { getLessonPracticeByLessonId } from "@/app/service/learning/lessons/practice/lessonPracticeService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { LessonPracticeWrapper } from "@/components/learning/courses/lesson/practice/LessonPracticeWrapper";
import { PracticeDisabled } from "@/components/misc/errors/PracticeDisalbed";
import { GamificationProvider } from "@/context/GamificationContext";
import { LessonPracticeDto, UserStatsDto } from "@/types/types";
import { notFound } from "next/navigation";

export default async function LessonPracticePage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const practiceCard: LessonPracticeDto | null = await getLessonPracticeByLessonId(lessonId);
    const userStats: UserStatsDto | null = await getUserStats();

    if (!courseId || !lessonId || !practiceCard || !userStats) {
        notFound();
    }

    if (userStats.lives !== 0) {
        return <PracticeDisabled backText="Back to lesson content" backUrl={`/courses/learn/${courseId}/lesson/${lessonId}`} />
    } 

    const initialUserStats: UserStatsDto | null = await getUserStats();

    if (!initialUserStats) {
        notFound();
    }

    const totalDuration = practiceCard.items.reduce((sum, section) => sum + section.duration, 0);

    return (
        <GamificationProvider initialUserStats={initialUserStats}>
            <LessonPracticeWrapper practiceItems={practiceCard.items} totalDuration={totalDuration} />
        </GamificationProvider>
    )
}
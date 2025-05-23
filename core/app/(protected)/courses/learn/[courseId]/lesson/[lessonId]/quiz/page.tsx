import { getClientViewQuestions, getExaminationTitle } from "@/app/service/learning/examination/examinationService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { ExaminationWrapper } from "@/components/learning/courses/examination/ExaminationWrapper";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { ExaminationClientViewDto, UserStatsDto } from "@/types/types";
import { QuizType } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;

    const questions: ExaminationClientViewDto[] | null = await getClientViewQuestions(QuizType.LESSON_QUIZ, lessonId);
    const quizTitle: string | null = await getExaminationTitle(lessonId, QuizType.LESSON_QUIZ);
    const userStats: UserStatsDto | null = await getUserStats();

    if (!courseId || !lessonId || questions === null || quizTitle === null || userStats === null) {
        return notFound();
    }

    return (
        <GamificationProvider initialUserStats={userStats}>
            <ExaminationProvider args={{
                questions,
                examinationType: QuizType.LESSON_QUIZ,
                examinationTitle: quizTitle,
                courseId,
                entityId: lessonId
            }}>
                <ExaminationWrapper lessonId={lessonId} />
            </ExaminationProvider>
        </GamificationProvider>
    )
}
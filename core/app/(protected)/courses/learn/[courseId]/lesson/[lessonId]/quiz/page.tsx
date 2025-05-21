import { getClientViewQuestions, getExaminationTitle } from "@/app/service/learning/examination/examinationService";
import { ExaminationWrapper } from "@/components/learning/courses/examination/ExaminationWrapper";
import { ExaminationProvider } from "@/context/ExaminationContext";
import { ExaminationClientViewDto } from "@/types/types";
import { QuizType } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;


    const questions: ExaminationClientViewDto[] | null = await getClientViewQuestions(QuizType.LESSON_QUIZ, lessonId);
    const quizTitle: string | null = await getExaminationTitle(lessonId, QuizType.LESSON_QUIZ);

    console.log('questions', questions)

    if (!courseId || !lessonId || questions === null || quizTitle === null) {
        return notFound();
    }

    return (
        <ExaminationProvider examinationType={QuizType.LESSON_QUIZ} examinationTitle={quizTitle}>
            <ExaminationWrapper/>
        </ExaminationProvider>
    )
}
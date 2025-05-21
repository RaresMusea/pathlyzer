import { getClientViewQuestions } from "@/app/service/learning/examination/examinationService";
import { ExaminationWrapper } from "@/components/learning/courses/examination/ExaminationWrapper";
import { ExaminationClientViewDto } from "@/types/types";
import { QuizType } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;

    const questions: ExaminationClientViewDto[] | null = await getClientViewQuestions(QuizType.LESSON_QUIZ, lessonId);

    console.log('questions', questions)

    if (!courseId || !lessonId || questions === null) {
        return notFound();
    }

    return (
        <ExaminationWrapper type={QuizType.LESSON_QUIZ} />
    )
}
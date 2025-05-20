import { ExaminationWrapper } from "@/components/learning/courses/examination/ExaminationWrapper";
import { QuizType } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;

    if (!courseId || !lessonId) {
        return notFound();
    }

    return (
        <ExaminationWrapper type={QuizType.LESSON_QUIZ} />
    )
}
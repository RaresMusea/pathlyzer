import { getLessonPracticeByLessonId } from "@/app/service/learning/lessons/practice/lessonPracticeService";
import { LessonPracticeWrapper } from "@/components/learning/courses/lesson/practice/LessonPracticeWrapper";
import { LessonPracticeDto } from "@/types/types";
import { notFound } from "next/navigation";

export default async function LessonPracticePage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const practiceCard: LessonPracticeDto | null = await getLessonPracticeByLessonId(lessonId);

    if (!courseId || !lessonId || !practiceCard) {
        notFound();
    }

    const totalDuration = practiceCard.items.reduce((sum, section) => sum + section.duration, 0);

    return (
        <LessonPracticeWrapper practiceItems={practiceCard.items} totalDuration={totalDuration} />
    )
}
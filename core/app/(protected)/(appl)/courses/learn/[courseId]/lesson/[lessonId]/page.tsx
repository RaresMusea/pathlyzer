import { getCurrentUserLessonProgress } from "@/app/service/learning/lessons/lessonProgressService";
import { getLessonContent } from "@/app/service/learning/lessons/lessonService";
import { LessonContent } from "@/components/learning/courses/lesson/LessonContent";
import { PageTransition } from "@/components/misc/animations/PageTransition";;
import { LessonContentDto } from "@/types/types";
import { notFound } from "next/navigation";

export default async function ReadLesson({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const lessonContent: LessonContentDto | null = await getLessonContent(lessonId);
    const userLearningProgress = await getCurrentUserLessonProgress(lessonId);

    if (!courseId || !lessonId || !lessonContent || userLearningProgress === null) {
        notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 space-y-8">
                <LessonContent lessonId={lessonId} lessonContent={lessonContent} userLearningProgress={userLearningProgress} />
            </div>
        </PageTransition>
    )
}
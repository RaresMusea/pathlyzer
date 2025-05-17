import { getLessonContent } from "@/app/service/learning/lessons/lessonService";
import { CoursePreview } from "@/components/learning/courses/course-preview/CoursePreview";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { LessonContentDto } from "@/types/types";
import { JSONContent } from "@tiptap/react";
import { notFound } from "next/navigation";

export default async function ReadLesson({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;
    const lessonContent: LessonContentDto | null = await getLessonContent(lessonId);

    if (!courseId || !lessonId || !lessonContent) {
        notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 space-y-8">
                 <h1 className="text-4xl font-semibold mb-5">{lessonContent.title}</h1>
                 <CoursePreview content={JSON.parse(String(lessonContent.content))} />
            </div>
        </PageTransition>
    )
}
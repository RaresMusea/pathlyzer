"use client";

import { LessonContentDto } from "@/types/types";
import { CoursePreview } from "../course-preview/CoursePreview";
import { useLearningSession } from "@/hooks/useLearningSession";

export const LessonContent = ({ lessonId, lessonContent }: { lessonId: string, lessonContent: LessonContentDto }) => {
    useLearningSession(lessonId);

    return (
        <>
            <h1 className="text-4xl font-semibold mb-5">{lessonContent.title}</h1>
            <CoursePreview content={JSON.parse(String(lessonContent.content))} />
        </>
    )
}
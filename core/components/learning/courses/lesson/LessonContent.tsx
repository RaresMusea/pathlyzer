"use client";

import { LessonContentDto } from "@/types/types";
import { CoursePreview } from "../course-preview/CoursePreview";
import { ProgressType, useLearningSession } from "@/hooks/useLearningSession";
import { useEffect, useRef } from "react";

export const LessonContent = ({ lessonId, lessonContent }: { lessonId: string, lessonContent: LessonContentDto }) => {
    const progressRef = useRef(0);

    useEffect(() => {
        const container = document.querySelector('.scrollContainer') as HTMLElement;

        if (!container) return;

        const onScroll = () => {
            progressRef.current = Math.floor((container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100);
        }

        container.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', onScroll);
        }
    }, []);

    useLearningSession(lessonId, ProgressType.LESSON, () => progressRef.current);

    return (
        <>
            <h1 className="text-4xl font-semibold mb-5">{lessonContent.title}</h1>
            <CoursePreview content={JSON.parse(String(lessonContent.content))} />
        </>
    )
}
"use client";

import { LessonContentDto } from "@/types/types";
import { CoursePreview } from "../course-preview/CoursePreview";
import { ProgressType, useLearningSession } from "@/hooks/useLearningSession";
import { useEffect, useRef } from "react";

export const LessonContent = ({ lessonId, lessonContent, userLearningProgress }: { lessonId: string, lessonContent: LessonContentDto, userLearningProgress: number }) => {
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

    useEffect(() => {
        const container = document.querySelector('.scrollContainer') as HTMLElement;
        if (!container) return;

        const restoreScroll = () => {
            const scrollTop = (userLearningProgress / 100) * (container.scrollHeight - container.clientHeight);
            container.scrollTo({ top: scrollTop, behavior: "smooth" });
        };

        const timeout = setTimeout(() => {
            if (userLearningProgress > 0 && userLearningProgress < 100) {
                restoreScroll();
            }
        }, 300);

        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            progressRef.current = Math.floor((scrollTop / (scrollHeight - clientHeight)) * 100);
        };

        container.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            clearTimeout(timeout);
            container.removeEventListener('scroll', onScroll);
        };
    }, [userLearningProgress]);

    useLearningSession(lessonId, ProgressType.LESSON, () => progressRef.current);

    return (
        <>
            <h1 className="text-4xl font-semibold mb-5">{lessonContent.title}</h1>
            <CoursePreview content={JSON.parse(String(lessonContent.content))} />
        </>
    )
}
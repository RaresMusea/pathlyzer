"use client";

import { LessonContentDto, SummarizedUserStats } from "@/types/types";
import { CoursePreview } from "../course-preview/CoursePreview";
import { ProgressType, useLearningSession } from "@/hooks/useLearningSession";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { OutOfLivesModalGeneric } from "./OutOfLivesModalGeneric";

export const LessonContent = ({ lessonId, lessonContent, userLearningProgress, userStats }: { lessonId: string, lessonContent: LessonContentDto, userLearningProgress: number, userStats: SummarizedUserStats }) => {
    const progressRef = useRef(0);
    const pathName = usePathname();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [outOfLivesModalVisible, setOutOfLivesModalVisible] = useState<boolean>(false);
    const router = useRouter();

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
            const progress = Math.floor((container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100);
            progressRef.current = progress;
            setScrollProgress(progress);
        };

        container.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            clearTimeout(timeout);
            container.removeEventListener('scroll', onScroll);
        };
    }, [userLearningProgress]);

    const handleQuizTaking = () => {
        console.log("USER LIVES", userStats.lives);
        if (userStats.lives === 0) {
            setOutOfLivesModalVisible(true);
            return;
        }

        router.push(`${pathName}/quiz`);
    }


    useLearningSession(lessonId, ProgressType.LESSON, () => progressRef.current);

    return (
        <>
            <h1 className="text-4xl font-semibold mb-5">{lessonContent.title}</h1>
            <CoursePreview content={JSON.parse(String(lessonContent.content))} />
            {scrollProgress >= 95 &&
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-right"
                    style={{ originX: 1 }}
                >
                    <Button onClick={handleQuizTaking} type="button" className="text-white transition-color bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)]">
                        <ListChecks className="mr-2 h-3 w-3" />
                        Take quiz
                    </Button>
                </motion.div>
            }
            {
                outOfLivesModalVisible &&
                <OutOfLivesModalGeneric open={outOfLivesModalVisible} setIsOpen={setOutOfLivesModalVisible} />
            }
        </>
    )
}
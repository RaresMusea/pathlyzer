"use client";

import { ExaminationLandingModal } from "./ExaminationLandingModal";
import { ExaminationExitConfirmationDialog } from "./ExaminationExitConfirmationDialog";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { getAppNavLogo } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExaminationComponent } from "./ExaminationComponent";
import { ExaminationState, useExamination } from "@/context/ExaminationContext";
import { ProgressType, useLearningSession } from "@/hooks/useLearningSession";
import { Progress } from "@/components/ui/progress";
import { ExaminationClientViewDto } from "@/types/types";
import { useGamification } from "@/context/GamificationContext";

export const ExaminationWrapper = ({ lessonId }: { lessonId: string }) => {
    const { examinationState, abortDialogVisible, inferExaminationTitle, livesAnimationVisible, openAbortModal, questions, currentQuestion } = useExamination();
    const { lives } = useGamification();
    useLearningSession(lessonId, ProgressType.EXAMINATION);
    const theme = useTheme().theme;

    return (
        <>
            <AnimatePresence>
                {abortDialogVisible && (
                    <ExaminationExitConfirmationDialog />
                )}

            </AnimatePresence>
            <header className="border-b font-nunito shadow-sm border-[hsl(var(--border))] py-3 px-4 sm:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                        <Image
                            src={getAppNavLogo(theme || "dark")}
                            width={80}
                            height={96}
                            alt="Logo"
                            className="object-contain"
                        />
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={openAbortModal}
                                className="rounded-full hover:bg-destructive/10"
                            >
                                <X className="h-5 w-5 text-destructive" />
                            </Button>
                            <ThemeToggle />
                            <div className="flex items-center font-nunito" title="Lives remaining">
                                <motion.div
                                    className="flex items-center"
                                    animate={
                                        livesAnimationVisible
                                            ? {
                                                x: [-2, 2, -2, 2, 0],
                                                scale: [1, 1.2, 1, 1.2, 1],
                                            }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.6,
                                        times: [0, 0.2, 0.4, 0.6, 1],
                                        ease: "easeInOut",
                                    }}
                                >
                                    <motion.div
                                        animate={
                                            livesAnimationVisible
                                                ? {
                                                    color: ["#EF4444", "#DC2626", "#B91C1C", "#EF4444"],
                                                }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.8,
                                            times: [0, 0.3, 0.7, 1],
                                        }}
                                    >
                                        <Heart
                                            className={`h-5 w-5 mr-1 transition-colors duration-200 ${livesAnimationVisible ? "text-red-600" : "text-red-500"
                                                }`}
                                            fill="currentColor"
                                        />
                                    </motion.div>
                                    <motion.span
                                        className="font-medium dark:text-white"
                                        animate={
                                            livesAnimationVisible
                                                ? {
                                                    scale: [1, 1.3, 1],
                                                    color: ["#374151", "#DC2626", "#374151"],
                                                }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.6,
                                            times: [0, 0.5, 1],
                                        }}
                                    >
                                        {lives}
                                    </motion.span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto max-w-md">
                        <h1 className="text-xl font-bold leading-tight ml-5">
                            {inferExaminationTitle()}
                        </h1>

                        {examinationState === ExaminationState.EXAMINATION && (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-2 w-full">
                                <span className="text-xs text-muted-foreground text-center sm:text-right sm:min-w-[48px] sm:order-first order-last mb-2 sm:mb-0">
                                    {questions.indexOf(currentQuestion as ExaminationClientViewDto) + 1} / {questions.length}
                                </span>
                                <Progress
                                    value={
                                        ((questions.indexOf(currentQuestion as ExaminationClientViewDto) + 1) / questions.length) * 100
                                    }
                                    className="h-2 w-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="hidden sm:flex items-center gap-2 min-w-[120px] justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={openAbortModal}
                            className="rounded-full hover:bg-destructive/10"
                        >
                            <X className="h-5 w-5 text-destructive" />
                        </Button>
                        <ThemeToggle />
                        <div className="flex items-center" title="Lives remaining">
                            <motion.div
                                className="flex items-center"
                                animate={
                                    livesAnimationVisible
                                        ? {
                                            x: [-2, 2, -2, 2, 0],
                                            scale: [1, 1.2, 1, 1.2, 1],
                                        }
                                        : {}
                                }
                                transition={{
                                    duration: 0.6,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                    ease: "easeInOut",
                                }}
                            >
                                <motion.div
                                    animate={
                                        livesAnimationVisible
                                            ? {
                                                color: ["#EF4444", "#DC2626", "#B91C1C", "#EF4444"],
                                            }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.8,
                                        times: [0, 0.3, 0.7, 1],
                                    }}
                                >
                                    <Heart
                                        className={`h-5 w-5 mr-1 transition-colors duration-200 ${livesAnimationVisible ? "text-red-600" : "text-red-500"
                                            }`}
                                        fill="currentColor"
                                    />
                                </motion.div>
                                <motion.span
                                    className="font-medium dark:text-white"
                                    animate={
                                        livesAnimationVisible
                                            ? {
                                                scale: [1, 1.3, 1],
                                                color: ["#374151", "#DC2626", "#374151"],
                                            }
                                            : {}
                                    }
                                    transition={{
                                        duration: 0.6,
                                        times: [0, 0.5, 1],
                                    }}
                                >
                                    {lives}
                                </motion.span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {
                examinationState === ExaminationState.LANDING ?
                    <ExaminationLandingModal />
                    :
                    <ExaminationComponent />
            }
        </>
    )
}
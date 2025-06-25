"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { getAppNavLogo } from "@/exporters/LogoExporter";
import { LessonPracticeItemDto } from "@/types/types";
import { BookOpen, Clock, Heart, X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LessonPracticeLandingModal from "./LessonPracticeLandingModal";
import { PracticeExitConfirmationModal } from "./modals/PracticeExitConfirmationModal";
import { LessonPracticeContent } from "./LessonPracticeContent";
import { PracticeCompletionModal } from "./modals/PracticeCompletionModal";
import { useGamification } from "@/context/GamificationContext";

enum LessonPracticeMode {
    PREPARATION,
    PRACTICE
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export const LessonPracticeWrapper = ({ practiceItems, totalDuration }: { practiceItems: LessonPracticeItemDto[], totalDuration: number }) => {
    const theme = useTheme().theme;
    const [mode, setMode] = useState<LessonPracticeMode>(LessonPracticeMode.PREPARATION);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [modalStates, setModalStates] = useState({ completionModalVisible: false, exitModalVisible: false });
    const [remainingTime, setRemainingTime] = useState<number>(totalDuration);
    const [isActive, setIsActive] = useState(false);
    const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
    const { lives } = useGamification();

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (
            mode !== LessonPracticeMode.PRACTICE ||
            !isActive ||
            modalStates.completionModalVisible ||
            modalStates.exitModalVisible
        ) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setElapsedTime((prevElapsed) => {
                const newTime = prevElapsed + 1;

                let accumulated = 0;
                for (let i = 0; i < practiceItems.length; i++) {
                    accumulated += practiceItems[i].duration;
                    if (newTime <= accumulated) {
                        setCurrentSectionIdx(i);
                        break;
                    }
                }

                if (newTime >= totalDuration) {
                    setIsActive(false);
                    setModalStates((prev) => ({ ...prev, completionModalVisible: true }));
                }

                return newTime;
            });

            setRemainingTime((prevRemaining) => Math.max(prevRemaining - 1, 0));
        }, 1000);
    }, [mode, isActive, modalStates, totalDuration, practiceItems]);


    const handleExit = () => {
        setModalStates((prev) => ({ ...prev, exitModalVisible: true }));
    }

    const handleCompletionModalClose = () => {
        setModalStates((prev) => ({ ...prev, completionModalVisible: false }));
        setElapsedTime(0);
        setRemainingTime(totalDuration);
        setIsActive(false);
        setCurrentSectionIdx(0);
    }

    const handleExitPracticeModalState = (openState: boolean) => {
        if (openState) {
            setModalStates((prev) => ({ ...prev, exitModalVisible: true }));
            return;
        }

        setModalStates((prev) => ({ ...prev, exitModalVisible: false }));
    }

    return (

        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col">
            <header className="bg-background/80 backdrop-blur-sm border-b border-[hsl(var(--border))] py-3 px-4 sm:px-6 sticky top-0 z-50 font-nunito">
                <div className="container mx-auto grid grid-cols-3 items-center">
                    <div className="flex items-center gap-2">
                        <Image
                            src={getAppNavLogo(theme || "dark")}
                            width={80}
                            height={96}
                            alt="Logo"
                            className="object-contain"
                        />
                    </div>

                    <div className="flex justify-center items-center space-x-4">
                        {mode === LessonPracticeMode.PRACTICE &&
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                <span className="font-medium text-foreground">{formatTime(elapsedTime)}</span>
                            </div>
                        }
                        <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-foreground">{mode === LessonPracticeMode.PRACTICE ? 'Practice Mode' : 'Lesson practice preparation'}</span>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3">
                        {mode === LessonPracticeMode.PRACTICE &&
                            <div className="flex items-center">
                                <Heart className="h-5 w-5 text-red-500 mr-1" fill="currentColor" />
                                <span className="font-medium text-foreground">
                                    {lives === 0 ? `+1 in ${formatTime(remainingTime)}` : `${lives}`}
                                </span>
                            </div>
                        }

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleExit}
                            className="rounded-full hover:bg-destructive/10"
                        >
                            <X className="h-5 w-5 text-destructive" />
                        </Button>

                        <ThemeToggle />
                    </div>
                </div>
            </header>
            {
                modalStates.exitModalVisible && <PracticeExitConfirmationModal handler={handleExitPracticeModalState} />
            }

            {
                mode === LessonPracticeMode.PRACTICE && modalStates.completionModalVisible &&
                <PracticeCompletionModal onClose={handleCompletionModalClose} practiceTime={totalDuration} />
            }

            {
                mode === LessonPracticeMode.PREPARATION ?
                    <LessonPracticeLandingModal onStart={() => { setMode(LessonPracticeMode.PRACTICE); setIsActive(true) }} remainingTime={1800} />
                    : <LessonPracticeContent practiceItems={practiceItems} totalDuration={totalDuration} elapsedTime={elapsedTime} currentSectionIdx={currentSectionIdx} />
            }
        </div>
    )
}
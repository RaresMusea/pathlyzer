"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { OutOfFocusWarningModal } from "./OutOfFocusWarningModal";
import { useExamination } from "@/context/ExaminationContext";
import { QuestionType } from "@prisma/client";
import { SingleChoiceQuestion } from "./questions/Questions";
import { getQuestionTypeIcon, getQuestionTypeLabel } from "@/lib/EvaluationUtils";
import { useGamification } from "@/context/GamificationContext";

const MAX_FOCUS_LOSSES: number = 3;

export const ExaminationComponent = () => {
    const {
        currentQuestion,
        selectedChoices,
        hasAnswered,
        isChecked,
        correctChoiceIds,
        outOfFocusVisible,
        openOutOfFocusModal,
        handleAnaswerSelection
    } = useExamination();

    const [focusLossCount, setFocusLossCount] = useState(0);
    const handleFocusLoss = () => {
        const newCount: number = focusLossCount + 1;
        setFocusLossCount(focusLossCount + 1);

        if (newCount >= MAX_FOCUS_LOSSES) {
            //@TODO: Set a penalty modal to visible
            //@TODO Lose all lives
        }
        else {
            openOutOfFocusModal();
        }
    }

    useEffect(() => {
        const handleViewSwitch = () => {
            if (document.visibilityState === 'hidden') {
                handleFocusLoss();
            }
        }

        const handleBlur = () => {
            handleFocusLoss()
        }

        document.addEventListener('visibilitychange', handleViewSwitch);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleViewSwitch);
            document.removeEventListener('blur', handleBlur);
        }
    }, [focusLossCount, handleFocusLoss]);

    return (
        <div>
            <AnimatePresence>
                {
                    outOfFocusVisible &&
                    <OutOfFocusWarningModal />
                }

                <main className="flex-1 container mx-auto px-4 py-8 flex flex-col font-nunito">
                    <motion.div
                        className="max-w-2xl mx-auto w-full flex-1 flex flex-col"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2 text-center">{currentQuestion?.prompt}</h2>
                            {currentQuestion?.type && (
                                <div className="flex items-center justify-center">
                                    <span>{getQuestionTypeIcon(currentQuestion.type)}</span>
                                    <span>{getQuestionTypeLabel(currentQuestion.type)}  question</span>

                                </div>
                            )}
                        </div>

                        {currentQuestion?.type === QuestionType.SINGLE && (
                            <SingleChoiceQuestion
                                question={currentQuestion}
                                selectedChoices={selectedChoices}
                                correctChoiceIds={correctChoiceIds}
                                hasAnswered={hasAnswered}
                                isChecked={isChecked}
                                onSelect={handleAnaswerSelection} />
                        )}
                    </motion.div>
                </main>
            </AnimatePresence>
        </div>
    )
}
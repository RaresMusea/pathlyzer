"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { OutOfFocusWarningModal } from "./OutOfFocusWarningModal";
import { useExamination } from "@/context/ExaminationContext";
import { QuestionType } from "@prisma/client";
import { CodeFillQuestion, MultiChoiceQuestion, SingleChoiceQuestion } from "./questions/Questions";
import { getQuestionTypeIcon, getQuestionTypeLabel } from "@/lib/EvaluationUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, ListCheck } from "lucide-react";
import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { OutOfLivesModal } from "./OutOfLivesModal";

const MAX_FOCUS_LOSSES: number = 3;

export const ExaminationComponent = () => {
    const {
        currentQuestion,
        codeFillAnswers,
        codeFillEvaluations,
        selectedChoices,
        answerStatus,
        correctChoiceIds,
        modals,
        isPending,
        openOutOfFocusModal,
        isCheckingDisabled,
        handleAnswerSelection,
        handleCodeFillAnswer,
        submitAnswer
    } = useExamination();

    const [focusLossCount, setFocusLossCount] = useState(0);

    const handleFocusLoss = useCallback(() => {
        const newCount: number = focusLossCount + 1;
        setFocusLossCount(focusLossCount + 1);

        if (newCount >= MAX_FOCUS_LOSSES) {
            //@TODO: Set a penalty modal to visible
            //@TODO Lose all lives
        }
        else {
            openOutOfFocusModal();
        }
    }, [setFocusLossCount, focusLossCount, openOutOfFocusModal]);

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
                    modals.outOfFocus &&
                    <OutOfFocusWarningModal key="outOfFocusWarning" />
                }

                {
                    modals.outOfLives &&
                    <OutOfLivesModal key="outOfLivesModal" />
                }

                <main key="examinationMain"
                    className={cn(
                        "flex-1 container mx-auto px-4 py-8 flex flex-col font-nunito transition-opacity duration-300",
                        modals.outOfFocus ? "opacity-20 pointer-events-none blur-sm" : "opacity-100"
                    )}
                >
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
                                answerStatus={answerStatus}
                                onSelect={handleAnswerSelection} />
                        )}

                        {currentQuestion?.type === QuestionType.MULTIPLE && (
                            <MultiChoiceQuestion
                                question={currentQuestion}
                                selectedChoices={selectedChoices}
                                correctChoiceIds={correctChoiceIds}
                                answerStatus={answerStatus}
                                onSelect={handleAnswerSelection} />
                        )}

                        {currentQuestion?.type === QuestionType.CODE_FILL && (
                            <CodeFillQuestion question={currentQuestion} answerStatus={answerStatus} codeFillAnswers={codeFillAnswers} codeFillEvaluations={codeFillEvaluations} handleCodeFillAnswer={handleCodeFillAnswer} />
                        )}
                    </motion.div>
                </main>

                <footer key="examinationFooter" className={cn("border-t py-4 px-6 shadow-md w-full absolute bottom-0 font-nunito bg-primary-foreground")}>
                    <div className="container mx-auto flex justify-center">
                        <motion.div
                            whileTap={{ scale: isCheckingDisabled() ? 1 : 0.95 }}
                            className="text-center w-full"
                        >
                            {isPending ?
                                <LoadingButton type="button" disabled={true}>Checking answer...</LoadingButton>
                                :
                                <Button type="button"
                                    disabled={isCheckingDisabled()}
                                    onClick={submitAnswer}
                                    size="lg"
                                    className={cn("text-white font-semibold transition-color w-80", answerStatus.isChecked ? (answerStatus.wasCorrect ? 'bg-green-600 dark:bg-green-900' : 'bg-red-400 dark:bg-red-800') : 'bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)]')}
                                    variant={answerStatus.isChecked ? (answerStatus.wasCorrect ? 'default' : 'destructive') : 'default'}>
                                    {answerStatus.isChecked
                                        ? (
                                            answerStatus.wasCorrect
                                                ? <span className="flex items-center gap-2"><CircleCheck className="w-4 h-4 mr-2" /> Corect! Well done!</span>
                                                : <span className="flex items-center gap-2"><CircleX className="w-4 h-4 mr-2" /> Wrong! Please try again</span>
                                        )
                                        : <span className="flex items-center gap-2"><ListCheck className="w-4 h-4 mr-2" /> Check answer</span>
                                    }
                                </Button>
                            }
                        </motion.div>
                    </div>
                </footer>
            </AnimatePresence>
        </div>
    )
}
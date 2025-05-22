"use client";

import { cn } from "@/lib/utils";
import { AnswerChoiceDto, ExaminationClientViewDto } from "@/types/types";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface BaseQuestionProps {
    question: ExaminationClientViewDto;
    hasAnswered: boolean;
}

interface SingleChoiceQuestionProps extends BaseQuestionProps {
    isChecked: boolean;
    correctChoiceIds: string[];
    selectedChoices: AnswerChoiceDto[];
    onSelect: (choice: AnswerChoiceDto) => void;
}

export const SingleChoiceQuestion = (props: SingleChoiceQuestionProps) => {
    const { question, selectedChoices, isChecked, correctChoiceIds, hasAnswered, onSelect } = props;
    if (!question || !question.answerChoices) return null;

    return (
        <div className="space-y-3">
            {question.answerChoices.map((choice, index) => {
                const isSelected: boolean = selectedChoices.some((c) => c.id === choice.id);
                const isCorrect: boolean = correctChoiceIds.length > 0 && correctChoiceIds.includes(choice.id as string);

                const showCorrectHighlight: boolean = hasAnswered && isCorrect
                const showIncorrectHighlight: boolean = hasAnswered && isSelected && !isCorrect

                return (
                    <motion.div
                        key={index}
                        className={cn(
                            "relative p-4 rounded-lg border cursor-pointer transition-colors duration-200",
                            isSelected && !isChecked && "border-[var(--pathlyzer)] bg-blue-50 dark:bg-blue-900/20",
                            showCorrectHighlight && "border-green-500 bg-green-100 dark:bg-green-900/20",
                            showIncorrectHighlight && "border-red-500 bg-red-100 dark:bg-red-900/20",
                            !isSelected &&
                            !showCorrectHighlight &&
                            "hover:border-gray-300 dark:hover:border-gray-600",
                            "border-gray-200 dark:border-gray-700"
                        )}
                        onClick={() => onSelect(choice)}
                        whileTap={{ scale: isChecked ? 1 : 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-base text-foreground">{choice.text}</span>

                            {showCorrectHighlight && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}

                            {showIncorrectHighlight && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
                                    <X className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </motion.div>

                )
            })}
        </div>
    )
}
"use client";

import { Input } from "@/components/ui/input";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { getCodeFillLangLabelBasedOnValue } from "@/lib/LearningPathManagementUtils";
import { cn } from "@/lib/utils";
import { AnswerChoiceDto, CodeFillEvaluationResult, ExaminationClientViewDto } from "@/types/types";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface BaseQuestionProps {
    question: ExaminationClientViewDto;
    hasAnswered: boolean;

}

interface ChoiceBasedQuestionProps extends BaseQuestionProps {
    selectedChoices: AnswerChoiceDto[];
    correctChoiceIds: string[];
    onSelect: (choice: AnswerChoiceDto) => void;
    isChecked: boolean;
}

interface CodeFillQuestionProps extends BaseQuestionProps {
    codeFillAnswers: Record<string, string[]>;
    codeFillEvaluations: Record<string, CodeFillEvaluationResult>;
    handleCodeFillAnswer: (questionId: string, answer: string[]) => void;
}

export const SingleChoiceQuestion = (props: ChoiceBasedQuestionProps) => {
    const { question, selectedChoices, isChecked, correctChoiceIds, hasAnswered, onSelect } = props;
    if (!question || !question.answerChoices) return null;

    return (
        <div className="space-y-3">
            {question.answerChoices.map((choice, index) => {
                const isSelected: boolean = selectedChoices.some((c) => c.id === choice.id);
                const isCorrect: boolean = correctChoiceIds.length > 0 && correctChoiceIds.includes(choice.id as string);

                const showCorrectHighlight: boolean = hasAnswered && isCorrect;
                const showIncorrectHighlight: boolean = hasAnswered && isSelected && !isCorrect;

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

export const MultiChoiceQuestion = (props: ChoiceBasedQuestionProps) => {
    const { question, selectedChoices, correctChoiceIds, isChecked, hasAnswered, onSelect } = props;

    if (!question || !question.answerChoices) return null;

    const isAnswerFullyCorrect = correctChoiceIds.length === selectedChoices.length &&
        correctChoiceIds.every((id) => selectedChoices.some((c) => c.id === id));

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Select all correct anwers.</p>

            {question.answerChoices.map((choice, index) => {
                const isSelected: boolean = selectedChoices.some((c) => c.id === choice.id);
                const isCorrect: boolean = correctChoiceIds.length > 0 && correctChoiceIds.includes(choice.id as string);
                
                const showCorrectHighlight: boolean = hasAnswered && isChecked && isAnswerFullyCorrect && isSelected && isCorrect;
                const showIncorrectHighlight: boolean = hasAnswered && isChecked && !isAnswerFullyCorrect && isSelected;

                return (
                    <motion.div
                        key={index}
                        className={cn(
                            "relative p-4 rounded-lg border cursor-pointer transition-colors duration-200",
                            showCorrectHighlight && "border-green-500 bg-green-100 dark:bg-green-900/20",
                            showIncorrectHighlight && "border-red-500 bg-red-100 dark:bg-red-900/20",
                            isSelected && !isChecked && "border-[var(--pathlyzer)] bg-blue-50 dark:bg-blue-900/20",
                            !isSelected &&
                            !showCorrectHighlight &&
                            "hover:border-gray-300 dark:hover:border-gray-600",
                            "border-gray-200 dark:border-gray-700"
                        )}
                        onClick={() => onSelect(choice)}
                        whileTap={{ scale: isChecked ? 1 : 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-base">{choice.text}</span>

                            {isSelected && !isChecked && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--pathlyzer-table-border)] text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                            )}

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

export const CodeFillQuestion = (props: CodeFillQuestionProps) => {
    const { question, codeFillAnswers, codeFillEvaluations, hasAnswered, handleCodeFillAnswer } = props;
    const theme = useTheme().theme;

    if (!question || !question.id || !question.codeSection) return null;

    const parts: string[] = question.codeSection.code.split(/(~~.*?~~)/g);
    const blankCount = parts.filter((p) => p.startsWith("~~") && p.endsWith("~~")).length;

    const userAnswers: string[] = codeFillAnswers[question.id] ?? Array(blankCount).fill("");

    const evaluation = codeFillEvaluations[question.id];
    const correctIndices: number[] = evaluation?.correctIndices ?? [];

    let blankIndex = 0;

    const handleChange = (index: number, value: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;

        handleCodeFillAnswer(question.id as string, newAnswers);
    }

    return (
        <div className="mt-4 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden bg-primary-foreground">
            <div className="px-4 py-2 border-b border-muted items-center bg-muted font-mono text-xs text-muted-foreground flex justify-between">
                <div className="flex items-center">
                    <Image className="mr-2" src={getLogoBasedOnTech(getCodeFillLangLabelBasedOnValue(question.codeSection.language as string), theme as string)} width={25} height={25} alt="Logo tech image" />
                    <span className="ml-2 font-semibold">{getCodeFillLangLabelBasedOnValue(question.codeSection.language as string)}</span>
                </div>
                <span>Fill in the blanks</span>
            </div>

            <div className="p-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap leading-relaxed">
                {parts.map((part, idx) => {
                    if (part.startsWith("~~") && part.endsWith("~~")) {
                        const current = blankIndex++;
                        const isSelected = !!userAnswers[current];
                        const isCorrect = correctIndices.includes(current);
                        const showCorrect = hasAnswered && isCorrect;
                        const showIncorrect = hasAnswered && isSelected && !isCorrect;
                        console.log("ID", question.id);

                        return (
                            <span key={`blank-${question.id}-${current}`} className="inline-block min-w-[100px] align-baseline mx-1 my-1">
                                <Input
                                    type="text"
                                    disabled={hasAnswered}
                                    value={userAnswers[current] ?? ""}
                                    onChange={(e) => handleChange(current, e.target.value)}
                                    placeholder="..."
                                    className={cn(
                                        "h-7 px-2 py-1 text-xs font-mono transition-colors",
                                        isSelected && !hasAnswered && "border-[var(--pathlyzer)] bg-blue-50 dark:bg-blue-900/20",
                                        showCorrect && "border-green-500 bg-green-300 dark:bg-green-800",
                                        showIncorrect && "border-red-500 bg-red-300 dark:bg-red-900",
                                        "border-gray-200 dark:border-gray-700"
                                    )}
                                />
                            </span>
                        );
                    }

                    return <span key={`text-${question.id}-${idx}`}>{part}</span>;
                })}
            </div>
        </div>
    );
}
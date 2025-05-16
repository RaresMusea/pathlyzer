"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { useEvaluation } from "@/hooks/useEvaluation";
import { availableCodeFillProgrammingLanguages, xpRewards } from "@/lib/LearningPathManagementUtils";
import { QuestionMutationDto } from "@/types/types";
import { QuestionType } from "@prisma/client";
import { useTheme } from "next-themes";
import Image from "next/image";

export const QuestionEditorFormGeneric = ({ question }: { question: QuestionMutationDto }) => {
    const { form, updateQuestionPrompt, updateQuestion } = useEvaluation();
    const { editingQuestionIndex } = useEditingQuestion();
    const theme = useTheme().theme;

    if (editingQuestionIndex === null) {
        return null;
    }

    return (
        <div>
            <FormField control={form.control} name={`quiz.questions.${editingQuestionIndex}.prompt`} render={({ field }) => (
                <FormItem>
                    <FormLabel>Question prompt</FormLabel>
                    <FormControl>
                        <Textarea
                            id="question-text"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                updateQuestionPrompt(question, e.target.value);
                            }}
                            className="mt-1"
                            rows={3}
                        />
                    </FormControl>
                    <FormMessage></FormMessage>
                </FormItem>
            )} />
            <div className="flex flex-col items-center lg:justify-between lg:flex-row lg:items-center">
                <FormField
                    control={form.control}
                    name={`quiz.questions.${editingQuestionIndex}.rewardXp`}
                    render={({ field }) => (
                        <FormItem className="mt-3">
                            <FormLabel>XP reward</FormLabel>
                            <FormControl>
                                <Select
                                    value={String(field.value ?? "")}
                                    onValueChange={(newValue) => {
                                        field.onChange(parseInt(newValue));
                                        updateQuestion(editingQuestionIndex, {
                                            ...question,
                                            rewardXp: parseInt(newValue),
                                        });
                                    }}
                                >
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Choose a reward" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {xpRewards.map((reward, index) => (
                                                <SelectItem key={index} value={`${reward}`}>
                                                    {reward} XP
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    question.type === QuestionType.CODE_FILL &&
                    <div>
                        <FormField
                            control={form.control}
                            name={`quiz.questions.${editingQuestionIndex}.codeSection.language`}
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Language</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value.length === 0 ? undefined : field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                updateQuestion(editingQuestionIndex, {
                                                    ...question,
                                                    codeSection: {
                                                        ...question.codeSection,
                                                        language: value,
                                                    },
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="w-[300px]">
                                                <SelectValue placeholder="Choose a programming language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableCodeFillProgrammingLanguages.map((language, index) => (
                                                    <SelectItem key={index} value={language.value}>
                                                        <div className="flex items-center font-nunito">
                                                            <Image className="mr-2" src={getLogoBasedOnTech(language.label, theme || 'dark')} width={25} height={25} alt="Programming language icon" />
                                                            <span>{language.label}</span>
                                                            
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                }
            </div>
        </div>
    )
}
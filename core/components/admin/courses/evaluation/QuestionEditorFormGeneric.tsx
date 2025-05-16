"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { useEvaluation } from "@/hooks/useEvaluation";
import { xpRewards } from "@/lib/LearningPathManagementUtils";
import { QuestionMutationDto } from "@/types/types";

export const QuestionEditorFormGeneric = ({ question }: { question: QuestionMutationDto }) => {
    const { form, updateQuestionPrompt, updateQuestion } = useEvaluation();
    const { editingQuestionIndex } = useEditingQuestion();

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
                                <SelectTrigger className="w-[180px]">
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
        </div>
    )
}
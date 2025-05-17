"use client";

import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { useEvaluation } from "@/hooks/useEvaluation";
import { MultipleChoiceQuestionDto } from "@/types/types";
import { QuestionEditorFormGeneric } from "./QuestionEditorFormGeneric";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MultipleChoiceQuestionError } from "@/schemas/LessonCreatorSchema";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

export const MultipleChoiceQuestionEditor = ({ question }: { question: MultipleChoiceQuestionDto }) => {
    const { form, addAnswerChoice, removeAnswerChoice, updateQuestion, handlChoiceDragEnd } = useEvaluation();
    const { editingQuestionIndex } = useEditingQuestion();

    if (editingQuestionIndex === null) {
        return;
    }

    return (
        <div className="space-y-6">
            <QuestionEditorFormGeneric question={question} />
            <div>
                <div className="flex justify-between items-center mb-2">
                    <Label>Answer choices (multiple valid answers)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addAnswerChoice(question)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add choice
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name={`quiz.questions.${editingQuestionIndex}.choices`}
                    render={({ field }) => {
                        const choices = field.value as Array<{ id?: string; text: string; isCorrect: boolean }>;
                        const questionError = form.formState.errors.quiz?.questions?.[editingQuestionIndex] as MultipleChoiceQuestionError;
                        const globalChoicesError =
                            questionError?.choices &&
                                !Array.isArray(questionError.choices) &&
                                "message" in questionError.choices
                                ? questionError.choices.message
                                : null;

                        const choiceErrors = Array.isArray(questionError?.choices)
                            ? questionError.choices
                            : undefined;

                        const onCorrectToggle = (toggledId: string, checkState: CheckedState) => {
                            const checked = checkState.valueOf();

                            const updatedChoices = choices.map((c) =>
                                c.id === toggledId ? { ...c, isCorrect: checked } : c
                            );

                            field.onChange(updatedChoices);
                        };

                        const onTextChange = (index: number, text: string) => {
                            const updatedChoices = [...choices];
                            updatedChoices[index] = { ...updatedChoices[index], text };

                            field.onChange(updatedChoices);
                            updateQuestion(editingQuestionIndex, {
                                ...question,
                                choices: updatedChoices,
                            });
                        };

                        return (
                            <FormItem>
                                {globalChoicesError !== null && <FormMessage />}
                                <DragDropContext onDragEnd={(result) => handlChoiceDragEnd(result, question)}>
                                    <Droppable droppableId="options">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-3"
                                            >
                                                {choices.map((choice, index) => {
                                                    const errorMessage = choiceErrors?.[index]?.text?.message;
                                                    return (
                                                        <Draggable
                                                            key={choice.id}
                                                            draggableId={choice.id || String(Date.now())}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className="flex items-center gap-2 border rounded-md p-3"
                                                                >
                                                                    <div
                                                                        {...provided.dragHandleProps}
                                                                        className="cursor-grab"
                                                                    >
                                                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                                                    </div>

                                                                    <Checkbox
                                                                        id={`option-correct-${index}`}
                                                                        checked={choice.isCorrect}
                                                                        onCheckedChange={(checked: CheckedState) => onCorrectToggle(choice.id || String(Date.now()), checked)}
                                                                    />

                                                                    <Input
                                                                        value={choice.text}
                                                                        onChange={(e) =>
                                                                            onTextChange(index, e.target.value)
                                                                        }
                                                                        className="flex-1"
                                                                    />

                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            const wasCorrect = choice.isCorrect;
                                                                            removeAnswerChoice(question, index);

                                                                            if (wasCorrect) {
                                                                                const updatedChoices = question.choices.filter((_, i) => i !== index);
                                                                                field.onChange([...updatedChoices]);
                                                                            }
                                                                        }}
                                                                        disabled={choices.length <= 2}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                    </Button>
                                                                    <p className="text-sm text-red-500 mt-1">
                                                                        {errorMessage}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                }
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </FormItem>
                        );
                    }}
                />
            </div>
        </div >
    )
}
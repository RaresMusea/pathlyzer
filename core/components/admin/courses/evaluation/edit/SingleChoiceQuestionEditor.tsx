"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { useEvaluation } from "@/hooks/useEvaluation";
import { SingleChoiceQuestionDto } from "@/types/types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, PlusCircle, Trash2 } from "lucide-react";
import { SingleChoiceQuestionError } from "@/schemas/LessonCreatorSchema";
import { QuestionEditorFormGeneric } from "./QuestionEditorFormGeneric";

export const SingleChoiceQuestionEditor = ({ question }: { question: SingleChoiceQuestionDto }) => {
    const { form, addAnswerChoice, removeAnswerChoice, updateQuestion, handlChoiceDragEnd } = useEvaluation();
    const { editingQuestionIndex } = useEditingQuestion();

    if (editingQuestionIndex === null) {
        return null
    }

    return (
        <div className="space-y-6">
            <QuestionEditorFormGeneric question={question} />
            <div>
                <div className="flex justify-between items-center mb-2">
                    <Label>Answer choices (only one valid answer)</Label>
                    <Button variant="outline" size="sm" onClick={() => addAnswerChoice(question)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add choice
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name={`quiz.questions.${editingQuestionIndex}.choices`}
                    render={({ field }) => {
                        const choices = field.value as Array<{ id?: string; text: string; isCorrect: boolean }>;

                        const correctChoiceId = choices.find((c) => c.isCorrect)?.id || "";
                        const questionError = form.formState.errors.quiz?.questions?.[editingQuestionIndex] as SingleChoiceQuestionError;
                        const globalChoicesError =
                            questionError?.choices &&
                                !Array.isArray(questionError.choices) &&
                                "message" in questionError.choices
                                ? questionError.choices.message
                                : null;

                        const choiceErrors = Array.isArray(questionError?.choices)
                            ? questionError.choices
                            : undefined;

                        console.warn("Global choices error", globalChoicesError);

                        const onCorrectChange = (selectedId: string) => {
                            const updatedChoices = choices.map((c) => ({
                                ...c,
                                isCorrect: c.id === selectedId,
                            }));
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
                                                <RadioGroup
                                                    value={correctChoiceId}
                                                    onValueChange={onCorrectChange}
                                                    className="space-y-1"
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

                                                                        <RadioGroupItem
                                                                            value={choice.id || String(Date.now())}
                                                                            id={`option-correct-${index}`}
                                                                        />

                                                                        <Input
                                                                            value={choice.text}
                                                                            onChange={(e) =>
                                                                                onTextChange(index, e.target.value)
                                                                            }
                                                                            className="flex-1"
                                                                        />

                                                                        <Button
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
                                                </RadioGroup>
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </FormItem>
                        );
                    }}
                />
            </div>
        </div>
    )
}
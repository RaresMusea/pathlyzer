"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEvaluation } from "@/hooks/useEvaluations";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { QuizType } from "@prisma/client";
import { CheckCircle, CheckSquare, Code, MoveDown, MoveUp, Trash2 } from "lucide-react";

export const EvaluationBuilder = ({ evaluationType }: { evaluationType: QuizType }) => {
    const {
        form,
        editingQuestionIndex,
        setEditingQuestionIndex,
        getQuestionTypeIcon,
        getQuestions,
        handleDragEnd,
        moveQuestionUp,
        moveQuestionDown,
        addSingleChoiceQuestion,
        addMultipleChoiceQuestion,
        removeQuestion
    } = useEvaluation();

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <FormField control={form.control} name="quiz.title" render={({ field }) => (
                                <FormItem>
                                    {form.formState.touchedFields.quiz?.title && (
                                        <FormMessage></FormMessage>
                                    )}
                                    <FormLabel />
                                    <FormControl>
                                        <input
                                            {...field}
                                            placeholder="Untitled quiz"
                                            defaultValue="Untitled quiz"
                                            className="w-full bg-transparent border-b text-medium font-nunito border-gray-300 focus:border-primary focus:outline-none py-1"
                                            type="text"
                                            maxLength={80}
                                        />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </CardTitle>
                        <CardDescription>{form.getValues("quiz.questions").length} questions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <Button
                                onClick={addSingleChoiceQuestion}
                                variant="outline"
                                className="flex flex-col h-auto py-2 px-1 sm:flex-row sm:py-1"
                            >
                                <CheckCircle className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1" />
                                <span className="text-xs sm:text-sm">Single choice</span>
                            </Button>
                            <Button
                                onClick={addMultipleChoiceQuestion}
                                variant="outline"
                                className="flex flex-col h-auto py-2 px-1 sm:flex-row sm:py-1"
                            >
                                <CheckSquare className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1" />
                                <span className="text-xs sm:text-sm">Multiple choice</span>
                            </Button>
                            <Button
                                onClick={() => { }}
                                variant="outline"
                                className="flex flex-col h-auto py-2 px-1 sm:flex-row sm:py-1">
                                <Code className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1" />
                                <span className="text-xs sm:text-sm">Code</span>
                            </Button>
                        </div>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="questions">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {getQuestions().map((question, index) => (
                                            <Draggable key={question.id} draggableId={String(question.id) || String(Date.now())} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`p-3 border rounded-md flex justify-between items-center ${editingQuestionIndex === index ? "border-primary bg-primary/5" : "border-gray-200"
                                                            }`}
                                                        onClick={() => setEditingQuestionIndex(index)}
                                                    >
                                                        <div className="flex items-center">
                                                            <span className="mr-2 font-medium">{index + 1}.</span>
                                                            <div className="flex items-center">
                                                                {getQuestionTypeIcon(question.type)}
                                                                <span className="truncate max-w-[120px]">{question.prompt}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    moveQuestionUp(index)
                                                                }}
                                                                disabled={index === 0}
                                                            >
                                                                <MoveUp className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    moveQuestionDown(index)
                                                                }}
                                                                disabled={index === getQuestions().length - 1}
                                                            >
                                                                <MoveDown className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    removeQuestion(index)
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
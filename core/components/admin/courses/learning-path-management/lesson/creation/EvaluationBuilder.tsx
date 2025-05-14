"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEvaluation } from "@/hooks/useEvaluation";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { QuestionType } from "@prisma/client";
import { CheckCircle, CheckSquare, Code, Eye, MoveDown, MoveUp, PlusCircle, Save, Trash2 } from "lucide-react";
import { SingleChoiceQuestionEditor } from "../../../evaluation/SingleChoiceQuestionEditor";
import { CodeFillQuestionDto, MultipleChoiceQuestionDto, SingleChoiceQuestionDto } from "@/types/types";
import { MultipleChoiceQuestionEditor } from "../../../evaluation/MultipleChoiceQuestionEditor";
import { CodeFillQuestionEditor } from "../../../evaluation/CodeFillQuestionEditor";

export const EvaluationBuilder = ({ evaluationType, setActiveTab }: { evaluationType: string, setActiveTab: (tab: string) => void }) => {
    const {
        form,
        editingQuestionIndex,
        setEditingQuestionIndex,
        getQuestionTypeIcon,
        getQuestionTypeLabel,
        getQuestions,
        handleDragEnd,
        moveQuestionUp,
        moveQuestionDown,
        addSingleChoiceQuestion,
        addMultipleChoiceQuestion,
        addCodeFillQuestion,
        removeQuestion,
        saveQuiz,
        updateQuestion
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
                                onClick={addCodeFillQuestion}
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
                        {getQuestions().length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <PlusCircle className="mx-auto h-12 w-12 mb-2 opacity-20" />
                                <p>Add the first question using the buttons above.</p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setActiveTab("preview")}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview {evaluationType.toLowerCase()}
                        </Button>
                        <Button onClick={saveQuiz} className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white">
                            <Save className="mr-2 h-4 w-4" />
                            Save {evaluationType.toLowerCase()}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="w-full lg:w-2/3">
                {editingQuestionIndex !== null && getQuestions()[editingQuestionIndex] ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Editare Întrebare {editingQuestionIndex + 1}</CardTitle>
                            <CardDescription>{getQuestionTypeLabel(getQuestions()[editingQuestionIndex].type)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {getQuestions()[editingQuestionIndex].type === QuestionType.SINGLE ? (
                                <SingleChoiceQuestionEditor
                                    question={getQuestions()[editingQuestionIndex] as SingleChoiceQuestionDto}
                                    onChange={(updatedQuestion) => updateQuestion(editingQuestionIndex, updatedQuestion)}
                                />
                            ) : getQuestions()[editingQuestionIndex].type === QuestionType.MULTIPLE ? (
                                <MultipleChoiceQuestionEditor
                                    question={getQuestions()[editingQuestionIndex] as MultipleChoiceQuestionDto}
                                    onChange={(updatedQuestion) => updateQuestion(editingQuestionIndex, updatedQuestion)}
                                />
                            ) : (
                                <CodeFillQuestionEditor
                                    question={getQuestions()[editingQuestionIndex] as CodeFillQuestionDto}
                                    onChange={(updatedQuestion) => updateQuestion(editingQuestionIndex, updatedQuestion)}
                                />
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12 text-gray-500">
                            <Code className="mx-auto h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg mb-2">No question selected</p>
                            <p>Select a question from the left side or add a new one.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
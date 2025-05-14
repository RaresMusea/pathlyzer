"use client";

import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { CodeFillQuestionDto, MultipleChoiceQuestionDto, QuestionMutationDto, SingleChoiceQuestionDto } from "@/types/types";
import { DropResult } from "@hello-pangea/dnd";
import { QuestionType } from "@prisma/client";
import { CheckCircle, CheckSquare, Code, FileText } from "lucide-react";
import { useState } from "react";

export function useEvaluation() {
    const { form } = useLessonBuilder();
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

    const getQuestions = (): QuestionMutationDto[] => {
        return form.getValues("quiz.questions");
    }

    const setQuestions = (questions: QuestionMutationDto[]) => {
        form.setValue("quiz.questions", questions)
    }

    const addSingleChoiceQuestion = () => {
        const questions: QuestionMutationDto[] = getQuestions();
        const newQuestion: SingleChoiceQuestionDto = {
            id: `question-${Date.now()}`,
            type: QuestionType.SINGLE,
            prompt: "Single choice question",
            order: questions.length + 1,
            rewardXp: 5,
            choices: [
                { id: `option-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
                { id: `option-${Date.now()}-2`, text: 'Option 2', isCorrect: false },
            ]
        }

        setQuestions([...questions, newQuestion]);
        setEditingQuestionIndex(questions.length);
    }

    const addMultipleChoiceQuestion = () => {
        const questions = getQuestions();
        const newQuestion: MultipleChoiceQuestionDto = {
            id: `question-${Date.now()}`,
            type: QuestionType.MULTIPLE,
            prompt: "Multiple choice question",
            order: questions.length + 1,
            rewardXp: 5,
            choices: [
                { id: `option-${Date.now()}-1`, text: 'Option 1', isCorrect: true },
                { id: `option-${Date.now()}-2`, text: 'Option 2', isCorrect: true },
                { id: `option-${Date.now()}-3`, text: 'Option 3', isCorrect: false },
            ]
        }

        setQuestions([...questions, newQuestion]);
        setEditingQuestionIndex(questions.length);
    }

    const addCodeFillQuestion = () => {
        const questions = getQuestions();
        const newQuestion: CodeFillQuestionDto = {
            id: `question-${Date.now()}`,
            type: QuestionType.CODE_FILL,
            prompt: 'Code fill question',
            order: questions.length + 1,
            rewardXp: 5,
            codeSections: [{
                language: 'javascript',
                code: 'function func() {\n  // Your code here\n  [[return 42]]\n}',
                correct: ['return 42'],
            }]
        };

        setQuestions([...questions, newQuestion]);
        setEditingQuestionIndex(questions.length);
    }

    const removeQuestion = (index: number) => {
        const questions = getQuestions();
        const newQuestions = [...questions];

        newQuestions.splice(index, 1);

        newQuestions.forEach((question, i) => {
            question.order = i + 1;
        });

        setQuestions(newQuestions);

        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(null);
        } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
            setEditingQuestionIndex(editingQuestionIndex - 1);
        }
    }

    const saveQuiz = () => {

    }

    const updateQuestion = (index: number, updatedQuestion: QuestionMutationDto): void => {

    }

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const newQuestions: QuestionMutationDto[] = [...getQuestions()]
        const [movedQuestion] = newQuestions.splice(result.source.index, 1)
        newQuestions.splice(result.destination.index, 0, movedQuestion);

        const orderedQuestions = newQuestions.map((q, index) => ({
            ...q,
            order: index + 1,
        }));

        setQuestions(orderedQuestions);

        if (editingQuestionIndex === result.source.index) {
            setEditingQuestionIndex(result.destination.index)
        } else if (
            editingQuestionIndex !== null &&
            editingQuestionIndex >= result.destination.index &&
            editingQuestionIndex < result.source.index
        ) {
            setEditingQuestionIndex(editingQuestionIndex + 1)
        } else if (
            editingQuestionIndex !== null &&
            editingQuestionIndex <= result.destination.index &&
            editingQuestionIndex > result.source.index
        ) {
            setEditingQuestionIndex(editingQuestionIndex - 1)
        }
    }

    const moveQuestionUp = (index: number) => {
        if (index === 0) return;

        const newQuestions = [...getQuestions()];

        const temp = newQuestions[index];
        newQuestions[index] = newQuestions[index - 1];
        newQuestions[index - 1] = temp;

        newQuestions[index].order = index + 1;
        newQuestions[index - 1].order = index;

        setQuestions(newQuestions);

        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(index - 1);
        } else if (editingQuestionIndex === index - 1) {
            setEditingQuestionIndex(index);
        }
    }

    const moveQuestionDown = (index: number) => {
        const questions = getQuestions();

        if (index === questions.length - 1) return;

        const newQuestions = [...questions];
        const temp = newQuestions[index];
        newQuestions[index] = newQuestions[index + 1];
        newQuestions[index + 1] = temp;

        newQuestions[index].order = index + 1;
        newQuestions[index + 1].order = index + 2;

        setQuestions(newQuestions);

        if (editingQuestionIndex === index) {
            setEditingQuestionIndex(index + 1);
        } else if (editingQuestionIndex === index + 1) {
            setEditingQuestionIndex(index);
        }
    }

    const getQuestionTypeIcon = (type: QuestionType) => {
        switch (type) {
            case QuestionType.SINGLE:
                return <CheckCircle className="h-4 w-4 mr-2" />
            case QuestionType.MULTIPLE:
                return <CheckSquare className="h-4 w-4 mr-2" />
            case QuestionType.CODE_FILL:
                return <Code className="h-4 w-4 mr-2" />
            default:
                return <FileText className="h-4 w-4 mr-2" />
        }
    }

    const getQuestionTypeLabel = (type: QuestionType): string => {
        switch (type) {
            case QuestionType.SINGLE:
                return 'Single choice';
            case QuestionType.MULTIPLE:
                return 'Multiple choice';
            case QuestionType.CODE_FILL:
                return 'Code fill';
            default:
                return 'Unknown';
        }
    }

    return {
        form,
        editingQuestionIndex,
        setEditingQuestionIndex,
        getQuestions,
        addSingleChoiceQuestion,
        addMultipleChoiceQuestion,
        addCodeFillQuestion,
        removeQuestion,
        saveQuiz,
        updateQuestion,
        moveQuestionUp,
        moveQuestionDown,
        handleDragEnd,
        getQuestionTypeIcon,
        getQuestionTypeLabel
    }
}
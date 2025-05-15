"use client";

import { useEditingQuestion } from "@/context/EditingQuestionContext";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { BaseChoiceDto, CodeFillQuestionDto, MultipleChoiceQuestionDto, QuestionMutationDto, SingleChoiceQuestionDto } from "@/types/types";
import { DropResult } from "@hello-pangea/dnd";
import { QuestionType } from "@prisma/client";
import { CheckCircle, CheckSquare, Code, FileText } from "lucide-react";

export function useEvaluation() {
    const { form } = useLessonBuilder();
    const { editingQuestionIndex, setEditingQuestionIndex } = useEditingQuestion();

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

    const addAnswerChoice = (question: QuestionMutationDto) => {
        console.log("Editing question index", editingQuestionIndex);

        if (!isChoiceQuestion(question)) {
            return;
        }

        const newAnswerChoice: BaseChoiceDto = {
            id: `option-${Date.now()}`,
            text: "New option",
            isCorrect: false,
        };

        if (editingQuestionIndex !== null) {
            updateQuestion(editingQuestionIndex, {
                ...question,
                choices: [...question.choices, newAnswerChoice],
            } as typeof question);
        }
    }

    const updateAnswerChoice = (index: number, question: QuestionMutationDto, updatedChoice: Partial<BaseChoiceDto>) => {
        if (!isChoiceQuestion(question)) return;
        if (editingQuestionIndex === null) return;

        const newChoices = [...question.choices];

        if (question.type === "SINGLE" && updatedChoice.isCorrect === true) {
            newChoices.forEach((choice, i) => {
                if (i !== index) {
                    newChoices[i] = { ...choice, isCorrect: false };
                }
            });
        }

        newChoices[index] = { ...newChoices[index], ...updatedChoice };

        const updatedQuestion: QuestionMutationDto = {
            ...question,
            choices: newChoices
        } as QuestionMutationDto;

        updateQuestion(editingQuestionIndex, { ...question, choices: newChoices });
    };

    const updateQuestionPrompt = (question: QuestionMutationDto, prompt: string) => {
        if (editingQuestionIndex === null) {
            return;
        }

        updateQuestion(editingQuestionIndex, { ...question, prompt })
    }

    const removeAnswerChoice = (question: QuestionMutationDto, index: number) => {
        if (!isChoiceQuestion(question)) {
            return;
        }

        if (editingQuestionIndex === null) return;


        const newChoices = [...question.choices];
        newChoices.splice(index, 1);

        updateQuestion(editingQuestionIndex, {
            ...question,
            choices: newChoices
        });
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
        form.setValue(
            `quiz.questions.${index}`,
            updatedQuestion,
            { shouldDirty: true, shouldValidate: true }
        );
    };

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

    const isChoiceQuestion = (question: QuestionMutationDto): question is SingleChoiceQuestionDto | MultipleChoiceQuestionDto => {
        return "choices" in question;
    }

    return {
        form,
        getQuestions,
        addSingleChoiceQuestion,
        addMultipleChoiceQuestion,
        addCodeFillQuestion,
        addAnswerChoice,
        updateAnswerChoice,
        removeAnswerChoice,
        updateQuestionPrompt,
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
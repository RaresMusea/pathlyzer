"use client";

import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { AnswerChoiceDto, CodeFillEvaluationResult, ExaminationClientViewDto } from "@/types/types";
import { QuestionType, QuizType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition } from "react";

export enum ExaminationState {
    LANDING,
    EXAMINATION
}

interface ExaminationContextProps {
    questions: ExaminationClientViewDto[];
    examinationType: QuizType;
    examinationTitle: string;
    codeFillAnswers: Record<string, string[]>;
    codeFillEvaluations: Record<string, CodeFillEvaluationResult>;
    abortDialogVisible: boolean;
    examinationState: ExaminationState;
    outOfFocusVisible: boolean;
    currentQuestion: ExaminationClientViewDto | null;
    selectedChoices: AnswerChoiceDto[] | [];
    isChecked: boolean;
    correctChoiceIds: string[];
    wasCorrect: boolean;
    hasAnswered: boolean;
    isPending: boolean;


    abortExamination: () => void;
    isCheckingDisabled: () => boolean;
    openAbortModal: () => void;
    closeAbortModal: () => void;
    toggleExaminationState: () => void;
    getSimplifiedExaminationType: () => string;
    openOutOfFocusModal: () => void;
    closeOutOfFocusModal: () => void;
    inferExaminationTitle: () => string;
    handleAnswerSelection: (answer: AnswerChoiceDto) => void;
    handleCodeFillAnswer: (questionId: string, answer: string[]) => void;
    submitAnswer: () => Promise<void>;
}

interface ExaminationProviderArgs {
    questions: ExaminationClientViewDto[];
    courseId: string;
    entityId: string;
    examinationType: QuizType;
    examinationTitle: string;
} 

const ExaminationContext = createContext<ExaminationContextProps | undefined>(undefined);

export const ExaminationProvider: React.FC<{ children: React.ReactNode, args: ExaminationProviderArgs }> = ({ children, args }) => {
    const {questions, examinationType, examinationTitle} = args;
    
    const router = useRouter();
    const [abortDialogVisible, setAbortDialogVisible] = useState(false);
    const [examinationState, setExaminationState] = useState<ExaminationState>(ExaminationState.LANDING);
    const [outOfFocusVisible, setOutOfFocusVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<ExaminationClientViewDto | null>(questions[0] || null);
    const [selectedChoices, setSelectedChoices] = useState<AnswerChoiceDto[] | []>([]);
    const [correctChoiceIds, setCorrectChoiceIds] = useState<string[]>([]);
    const [wasCorrect, setWasCorrect] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [codeFillAnswers, setCodeFillAnswers] = useState<Record<string, string[]>>({});
    const [codeFillEvaluations, setCodeFillEvaluations] = useState<Record<string, CodeFillEvaluationResult>>({});
    const [isPending, startTransition] = useTransition();

    const abortExamination = () => {
        if (examinationType === QuizType.LESSON_QUIZ) {
            setAbortDialogVisible(false);
            router.push('../..');
        }
    }

    const openAbortModal = () => {
        setAbortDialogVisible(true);
    }

    const openOutOfFocusModal = () => {
        setOutOfFocusVisible(true);
    }

    const closeOutOfFocusModal = () => {
        setOutOfFocusVisible(false);
    }

    const closeAbortModal = () => {
        setAbortDialogVisible(false);
    }

    const toggleExaminationState = () => {
        setExaminationState(examinationState === ExaminationState.LANDING ? ExaminationState.EXAMINATION : ExaminationState.EXAMINATION);
    }

    const inferExaminationTitle = (): string => {
        if (examinationState === ExaminationState.LANDING) {
            return `${getFormattedType(examinationType)} preparation`
        }
        return examinationTitle;
    }


    const getSimplifiedExaminationType = (): string => {
        if (examinationType === QuizType.LESSON_QUIZ) {
            return 'Quiz'
        }

        if (examinationType === QuizType.UNIT_EXAM) {
            return 'Exam';
        }

        return '';
    }

    const handleAnswerSelection = (answer: AnswerChoiceDto): void => {
        if (currentQuestion?.type === QuestionType.SINGLE) {
            setSelectedChoices([answer]);
        }
        if (currentQuestion?.type === QuestionType.MULTIPLE) {
            const isSelected: boolean = selectedChoices.some((c) => c.id === answer.id);

            if (isSelected) {
                setSelectedChoices(selectedChoices.filter((c) => c.id !== answer.id));
            } else {
                setSelectedChoices([...selectedChoices, answer]);
            }
        }
    }

    const handleCodeFillAnswer = (questionId: string, answer: string[]): void => {
        setCodeFillAnswers((prev) => ({
            ...prev,
            [questionId]: answer
        }));
    }

    const getAnswerPayload = (): string[] => {
        if (!currentQuestion) return [];

        switch (currentQuestion.type) {
            case QuestionType.SINGLE:
            case QuestionType.MULTIPLE:
                return selectedChoices.map((c) => c.id as string);

            case QuestionType.CODE_FILL:
                return codeFillAnswers[currentQuestion.id as string] ?? [];

            default:
                return [];
        }
    };

    const isCheckingDisabled = (): boolean => {
        if (!currentQuestion) return true;

        switch (currentQuestion.type) {
            case QuestionType.SINGLE:
            case QuestionType.MULTIPLE:
                return selectedChoices.length === 0;

            case QuestionType.CODE_FILL: {
                const answers = codeFillAnswers[currentQuestion.id as string];
                const hasAnyFilled = Array.isArray(answers) && answers.some((val) => val.trim() !== "");
                return !hasAnyFilled;
            }

            default:
                return true;
        }
    };

    const submitAnswer = async () => {
        startTransition(async () => {
            const response =  await axios.post(`/api/courses/`) 
        });
    }

    return (
        <ExaminationContext.Provider
            value={{
                questions,
                isPending,
                examinationType,
                codeFillAnswers,
                codeFillEvaluations,
                selectedChoices,
                wasCorrect,
                currentQuestion,
                hasAnswered,
                examinationTitle,
                correctChoiceIds,
                examinationState,
                isChecked,
                abortDialogVisible,
                outOfFocusVisible,
                abortExamination,
                openAbortModal,
                isCheckingDisabled,
                closeAbortModal,
                toggleExaminationState,
                getSimplifiedExaminationType,
                openOutOfFocusModal,
                closeOutOfFocusModal,
                inferExaminationTitle,
                handleAnswerSelection,
                handleCodeFillAnswer,
                submitAnswer
            }}>
            {children}
        </ExaminationContext.Provider>
    )
}

export const useExamination = () => {
    const context = useContext(ExaminationContext);

    if (!context) {
        throw new Error("useExamination() must be used within an ExaminationProvider!");
    }

    return context;
};
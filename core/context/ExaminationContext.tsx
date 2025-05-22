"use client";

import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { AnswerChoiceDto, ExaminationClientViewDto } from "@/types/types";
import { QuestionType, QuizType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";
import { useGamification } from "./GamificationContext";

export enum ExaminationState {
    LANDING,
    EXAMINATION
}

interface ExaminationContextProps {
    questions: ExaminationClientViewDto[];
    examinationType: QuizType;
    examinationTitle: string;
    abortDialogVisible: boolean;
    examinationState: ExaminationState;
    outOfFocusVisible: boolean;
    currentQuestion: ExaminationClientViewDto | null;
    selectedChoices: AnswerChoiceDto[] | [];
    isChecked: boolean;
    correctChoiceIds: string[];
    wasCorrect: boolean;
    hasAnswered: boolean;


    abortExamination: () => void;
    openAbortModal: () => void;
    closeAbortModal: () => void;
    toggleExaminationState: () => void;
    getSimplifiedExaminationType: () => string;
    openOutOfFocusModal: () => void;
    closeOutOfFocusModal: () => void;
    inferExaminationTitle: () => string;
    handleAnaswerSelection: (answer: AnswerChoiceDto) => void;
}

const ExaminationContext = createContext<ExaminationContextProps | undefined>(undefined);

export const ExaminationProvider: React.FC<{ children: React.ReactNode, questions: ExaminationClientViewDto[], examinationType: QuizType, examinationTitle: string }> = ({ children, examinationType, examinationTitle, questions }) => {
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

    const handleAnaswerSelection = (answer: AnswerChoiceDto): void => {
        if (currentQuestion?.type === QuestionType.SINGLE) {
            setSelectedChoices([answer]);
        }
        // if (!selectedChoices.some((choice) => choice.id === answer.id)) {
        //     setSelectedChoices((prev) => [...prev, answer]);
        // }
    }



    return (
        <ExaminationContext.Provider
            value={{
                questions,
                examinationType,
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
                closeAbortModal,
                toggleExaminationState,
                getSimplifiedExaminationType,
                openOutOfFocusModal,
                closeOutOfFocusModal,
                inferExaminationTitle,
                handleAnaswerSelection
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
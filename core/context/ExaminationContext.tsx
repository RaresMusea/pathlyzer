"use client";

import { QuizType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

export enum ExaminationState {
    LANDING,
    EXAMINATION
}

interface ExaminationContextProps {
    examinationType: QuizType;
    examinationTitle: string;
    abortDialogVisible: boolean;
    examinationState: ExaminationState;
    outOfFocusVisible: boolean;


    abortExamination: () => void;
    openAbortModal: () => void;
    closeAbortModal: () => void;
    toggleExaminationState: () => void;
    getSimplifiedExaminationType: () => string;
    openOutOfFocusModal: () => void;
    closeOutOfFocusModal: () => void;
}

const ExaminationContext = createContext<ExaminationContextProps | undefined>(undefined);

export const ExaminationProvider: React.FC<{ children: React.ReactNode, examinationType: QuizType, examinationTitle: string }> = ({ children, examinationType, examinationTitle }) => {
    const router = useRouter();
    const [abortDialogVisible, setAbortDialogVisible] = useState(false);
    const [examinationState, setExaminationState] = useState<ExaminationState>(ExaminationState.LANDING);
    const [outOfFocusVisible, setOutOfFocusVisible] = useState(false);

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


    const getSimplifiedExaminationType = (): string => {
        if (examinationType === QuizType.LESSON_QUIZ) {
            return 'Quiz'
        }

        if (examinationType === QuizType.UNIT_EXAM) {
            return 'Exam';
        }

        return '';
    }



    return (
        <ExaminationContext.Provider
            value={{
                examinationType,
                examinationTitle,
                examinationState,
                abortDialogVisible,
                outOfFocusVisible,
                abortExamination,
                openAbortModal,
                closeAbortModal,
                toggleExaminationState,
                getSimplifiedExaminationType,
                openOutOfFocusModal,
                closeOutOfFocusModal
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
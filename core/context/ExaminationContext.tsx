"use client";

import { CORRECT_ANSWER_AUDIO, INCORRECT_ANSWER_AUDIO, OUT_OF_HEARTS_AUDIO } from "@/exporters/AudioExporter";
import { playSound } from "@/lib/AudioUtils";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { AnswerChoiceDto, CodeFillEvaluationResult, ExaminationClientViewDto } from "@/types/types";
import { QuestionType, QuizType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition } from "react";
import { toast } from "sonner";
import { useGamification } from "./GamificationContext";
import { set } from "lodash";

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
    livesAnimationVisible: boolean;
    outOfFocusVisible: boolean;
    outOfLivesModalVisible: boolean;
    currentQuestion: ExaminationClientViewDto | null;
    selectedChoices: AnswerChoiceDto[] | [];
    isChecked: boolean;
    gainedXp: number;
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
    closeOutOfLivesModal: () => void;
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
    const { courseId, entityId, questions, examinationType, examinationTitle } = args;

    const router = useRouter();
    const { lives, setLives } = useGamification();
    const [abortDialogVisible, setAbortDialogVisible] = useState(false);
    const [examinationState, setExaminationState] = useState<ExaminationState>(ExaminationState.LANDING);
    const [outOfFocusVisible, setOutOfFocusVisible] = useState(false);
    const [outOfLivesModalVisible, setOutOfLivesModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<ExaminationClientViewDto | null>(questions[0] || null);
    const [selectedChoices, setSelectedChoices] = useState<AnswerChoiceDto[] | []>([]);
    const [correctChoiceIds, setCorrectChoiceIds] = useState<string[]>([]);
    const [wasCorrect, setWasCorrect] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [gainedXp, setGainedXp] = useState(0);
    const [livesAnimationVisible, setLivesAnimationVisible] = useState(false);
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

    const closeOutOfLivesModal = () => {
        setOutOfLivesModalVisible(false);
        //todo: Go to another page
    }

    const navigateToNextQuestion = () => {
        setTimeout(() => {
            const currentQuestionIndex = questions.indexOf(currentQuestion as ExaminationClientViewDto);
            const totalQuestions: number = questions.length;

            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestion(questions[currentQuestionIndex + 1]);
                setWasCorrect(false);
                setSelectedChoices([]);
                setHasAnswered(false);
                setIsChecked(false);
                setCorrectChoiceIds([]);
                setCodeFillAnswers((prev) => ({
                    ...prev,
                    [currentQuestion?.id as string]: []
                }));
            } else {
                //TODO
                // Quiz completed - show completion modal
            }
        }, 1500)
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

    const handleLifeLoss = () => {
        const prevLives = lives;
        if ((prevLives - 1) > 0) {
            setLivesAnimationVisible(true);

            setTimeout(() => {
                setLivesAnimationVisible(false);
            }, 1000);

            setLives(prevLives - 1);
        } else {
            setTimeout(() => playSound(OUT_OF_HEARTS_AUDIO), 1000);
            setOutOfLivesModalVisible(true);
            setLives(0);
        }
    };

    const resetStates = () => {
        setTimeout(() => {
            setWasCorrect(false);
            setSelectedChoices([]);
            setHasAnswered(false);
            setIsChecked(false);
            setCorrectChoiceIds([]);
            setCodeFillAnswers((prev) => ({
                ...prev,
                [currentQuestion?.id as string]: []
            }));
        }, 1500);
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
            const response = await axios.post(`/api/courses/${courseId}/lessons/${entityId}/quiz/check`, {
                quizType: examinationType,
                questionId: currentQuestion?.id,
                answer: getAnswerPayload()
            });

            if (response.status === 200) {
                const data = response.data;

                if (data.result.isCorrect) {
                    setHasAnswered(true);
                    setIsChecked(true);
                    playSound(CORRECT_ANSWER_AUDIO);
                    setGainedXp((prev) => prev + data.result.gainedXp);
                    navigateToNextQuestion();
                }
                else {
                    handleLifeLoss();
                    setHasAnswered(true);
                    setIsChecked(true);
                    playSound(INCORRECT_ANSWER_AUDIO);
                    setLivesAnimationVisible(true);
                    resetStates();
                }

                setWasCorrect(data.result.isCorrect);

                if (currentQuestion?.type === QuestionType.SINGLE || currentQuestion?.type === QuestionType.MULTIPLE && data.result.correctChoiceIds) {
                    setCorrectChoiceIds(data.result.correctChoiceIds);
                }

                if (currentQuestion?.type === QuestionType.CODE_FILL && data.result.correctIndices) {
                    setCodeFillEvaluations((prev) => ({
                        ...prev,
                        [currentQuestion.id as string]: {
                            questionId: currentQuestion.id as string,
                            isCorrect: data.result.isCorrect,
                            correctIndices: data.result.correctIndices
                        }
                    }));
                }
            }
            else {
                toast.error(response.data.message);
                router.push(`courses/learn/${courseId}`);
            }
        });
    }

    return (
        <ExaminationContext.Provider
            value={{
                questions,
                isPending,
                livesAnimationVisible,
                examinationType,
                codeFillAnswers,
                codeFillEvaluations,
                gainedXp,
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
                outOfLivesModalVisible,
                abortExamination,
                openAbortModal,
                isCheckingDisabled,
                closeAbortModal,
                toggleExaminationState,
                getSimplifiedExaminationType,
                openOutOfFocusModal,
                closeOutOfFocusModal,
                closeOutOfLivesModal,
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
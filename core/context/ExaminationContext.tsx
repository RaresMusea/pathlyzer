"use client";

import { CORRECT_ANSWER_AUDIO, INCORRECT_ANSWER_AUDIO, OUT_OF_HEARTS_AUDIO } from "@/exporters/AudioExporter";
import { playSound } from "@/lib/AudioUtils";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { AnswerChoiceDto, CheckResponseDto, CodeFillEvaluationResult, ExaminationClientViewDto, ExaminationFinishedResponse } from "@/types/types";
import { QuestionType, QuizType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useGamification } from "./GamificationContext";
import { finishQuiz, submitExaminationAnswer } from "@/app/service/learning/examination/examinationService";

export enum ExaminationState {
    LANDING,
    EXAMINATION
}

interface ExaminationContextProps {
    questions: ExaminationClientViewDto[];
    examinationType: QuizType;
    examinationTitle: string;
    examinationSucceeded: boolean
    modals: { abort: boolean, outOfFocus: boolean, outOfLives: boolean, complete: boolean };
    answerStatus: { wasCorrect: boolean; hasAnswered: boolean; isChecked: boolean; };
    codeFillAnswers: Record<string, string[]>;
    codeFillEvaluations: Record<string, CodeFillEvaluationResult>;
    examinationState: ExaminationState;
    livesAnimationVisible: boolean
    currentQuestion: ExaminationClientViewDto | null;
    selectedChoices: AnswerChoiceDto[] | [];
    gainedXp: number;
    correctChoiceIds: string[];
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
    isLastFromUnit: boolean;
    courseId: string;
    entityId: string;
    examinationType: QuizType;
    examinationTitle: string;
    examinationElementId: string;
}

const ExaminationContext = createContext<ExaminationContextProps | undefined>(undefined);

export const ExaminationProvider: React.FC<{ children: React.ReactNode, args: ExaminationProviderArgs }> = ({ children, args }) => {
    const { courseId, entityId, questions, examinationType, examinationTitle, examinationElementId, isLastFromUnit } = args;

    const router = useRouter();
    const { lives, setLives, level, setLevel, xp, setXp } = useGamification();
    const [modals, setModals] = useState({
        abort: false,
        outOfFocus: false,
        outOfLives: false,
        complete: false
    });

    const openModal = (key: keyof typeof modals) => setModals((prev) => ({ ...prev, [key]: true }));
    const closeModal = (key: keyof typeof modals) => setModals((prev) => ({ ...prev, [key]: false }));
    const [answerStatus, setAnswerStatus] = useState({
        wasCorrect: false,
        hasAnswered: false,
        isChecked: false,
    });
    const [examinationState, setExaminationState] = useState<ExaminationState>(ExaminationState.LANDING);
    const [currentQuestion, setCurrentQuestion] = useState<ExaminationClientViewDto | null>(questions[0] || null);
    const [selectedChoices, setSelectedChoices] = useState<AnswerChoiceDto[] | []>([]);
    const [correctChoiceIds, setCorrectChoiceIds] = useState<string[]>([]);
    const [gainedXp, setGainedXp] = useState(0);
    const [examinationSucceeded, setExaminationSucceeded] = useState(false);
    const [livesAnimationVisible, setLivesAnimationVisible] = useState(false);
    const [codeFillAnswers, setCodeFillAnswers] = useState<Record<string, string[]>>({});
    const [codeFillEvaluations, setCodeFillEvaluations] = useState<Record<string, CodeFillEvaluationResult>>({});
    const [isPending, startTransition] = useTransition();
    const [prevXp, setPrevXp] = useState(0);
    const currentIndex = useMemo(() => {
        return questions.findIndex(q => q.id === currentQuestion?.id);
    }, [questions, currentQuestion]);

    const hasMarkedCompletion = useRef(false);

    useEffect(() => {
        if (!examinationSucceeded || hasMarkedCompletion.current) return;

        hasMarkedCompletion.current = true;


    }, [examinationSucceeded]);

    const abortExamination = useCallback(() => {
        if (examinationType === QuizType.LESSON_QUIZ) {
            closeModal('abort');
            router.push('../..');
        }
    }, [examinationType, router, closeModal]);

    const openAbortModal = useCallback(() => {
        openModal('abort');
    }, [openModal]);

    const openCompletionModal = useCallback(() => {
        openModal('complete');
    }, [openModal]);

    const openOutOfFocusModal = useCallback(() => {
        openModal('outOfFocus');
    }, [openModal]);

    const closeOutOfFocusModal = useCallback(() => {
        closeModal('outOfFocus');
    }, [closeModal]);

    const closeOutOfLivesModal = useCallback(() => {
        closeModal('outOfLives');
        //todo: Go to another page
    }, [closeModal])

    const closeAbortModal = useCallback(() => {
        closeModal('abort');
    }, [closeModal]);

    const navigateToNextQuestion = useCallback(() => {
        setTimeout(() => {
            const totalQuestions: number = questions.length;

            if (currentIndex < totalQuestions - 1) {
                setCurrentQuestion(questions[currentIndex + 1]);
                if (currentIndex < totalQuestions - 1) {
                    resetQuestionState();
                } else {
                    openModal("complete");
                }
            } else {
                setExaminationSucceeded(true);
            }
        }, 1500)
    }, [setCurrentQuestion, setAnswerStatus, setSelectedChoices, setCorrectChoiceIds, setCodeFillAnswers, currentIndex, questions, currentQuestion, openModal]);

    const toggleExaminationState = useCallback(() => {
        setExaminationState(examinationState === ExaminationState.LANDING ? ExaminationState.EXAMINATION : ExaminationState.EXAMINATION);
    }, [examinationState])

    const inferExaminationTitle = (): string => {
        if (examinationState === ExaminationState.LANDING) {
            return `${getFormattedType(examinationType)} preparation`
        }
        return examinationTitle;
    };

    const handleLifeLoss = useCallback(() => {
        const prevLives = lives;
        if ((prevLives - 1) > 0) {
            setLivesAnimationVisible(true);

            setTimeout(() => {
                setLivesAnimationVisible(false);
            }, 1000);

            setLives(prevLives - 1);
        } else {
            setTimeout(() => playSound(OUT_OF_HEARTS_AUDIO), 1000);
            openModal('outOfLives');
            setLives(0);
        }
    }, [lives, setLives, openModal, setLivesAnimationVisible]);

    const resetQuestionState = useCallback(() => {
        setAnswerStatus({ wasCorrect: false, hasAnswered: false, isChecked: false });
        setSelectedChoices([]);
        setCorrectChoiceIds([]);

        if (currentQuestion?.id) {
            setCodeFillAnswers((prev) => ({ ...prev, [currentQuestion.id as string]: [] }));
        }
    }, [currentQuestion, setSelectedChoices, setAnswerStatus, setCorrectChoiceIds, setCodeFillAnswers]);


    const getSimplifiedExaminationType = (): string => {
        if (examinationType === QuizType.LESSON_QUIZ) {
            return 'Quiz'
        }

        if (examinationType === QuizType.UNIT_EXAM) {
            return 'Exam';
        }

        return '';
    };

    const handleAnswerSelection = useCallback((answer: AnswerChoiceDto): void => {
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
    }, [setSelectedChoices, selectedChoices, currentQuestion]);

    const handleCodeFillAnswer = useCallback((questionId: string, answer: string[]): void => {
        setCodeFillAnswers((prev) => ({
            ...prev,
            [questionId]: answer
        }));
    }, [setCodeFillAnswers]);

    const getAnswerPayload = useCallback((): string[] => {
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
    }, [currentQuestion, selectedChoices, codeFillAnswers]);

    const isCheckingDisabled = useCallback((): boolean => {
        if (!currentQuestion) return true;

        if (answerStatus.isChecked) return true;

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
    }, [currentQuestion, selectedChoices, codeFillAnswers, answerStatus]);

    const submitAnswer = useCallback(async () => {
        startTransition(async () => {
            const response = await submitExaminationAnswer(courseId, entityId, { quizType: examinationType, questionId: currentQuestion?.id as string, answer: getAnswerPayload() });

            if (response.status === 200) {
                const data = response.data as CheckResponseDto;

                setAnswerStatus({ wasCorrect: data.result.isCorrect, hasAnswered: true, isChecked: true });

                if (data.result.isCorrect) {
                    playSound(CORRECT_ANSWER_AUDIO);
                    data.rewardXp && setGainedXp((prev) => prev + (data.rewardXp || 0));
                    navigateToNextQuestion();
                }
                else {
                    handleLifeLoss();
                    playSound(INCORRECT_ANSWER_AUDIO);
                    setLivesAnimationVisible(true);
                    setTimeout(() => resetQuestionState(), 2500);

                }

                if ((currentQuestion?.type === QuestionType.SINGLE || currentQuestion?.type === QuestionType.MULTIPLE) && data.result.correctChoiceIds) {
                    setCorrectChoiceIds(data.result.correctChoiceIds as string[]);
                    console.log("Correct choice ids", data.result.correctChoiceIds);
                }

                if (currentQuestion?.type === QuestionType.CODE_FILL && data.result.correctIndices) {
                    setCodeFillEvaluations((prev) => ({
                        ...prev,
                        [currentQuestion.id as string]: {
                            questionId: currentQuestion.id as string,
                            isCorrect: data.result.isCorrect,
                            correctIndices: data.result.correctIndices as number[]
                        }
                    }));
                }
            }
            else {
                toast.error(response.data.message);
                router.push(`courses/learn/${courseId}`);
            }
        });
    }, [courseId, entityId, examinationType, currentQuestion, getAnswerPayload, startTransition, navigateToNextQuestion, handleLifeLoss, resetQuestionState, router]);

    const finishExamination = async () => {
        startTransition(async () => {
            if (examinationType === QuizType.LESSON_QUIZ) {
                try {
                    const response = await finishQuiz(courseId, entityId, { quizId: examinationElementId, gainedXp, isLastLesson: isLastFromUnit });

                    if (response.status === 200) {
                        const data = response.data as ExaminationFinishedResponse;
                        setPrevXp(xp);
                        setXp(data.gainedXp);
                        setLevel(data.level);
                        openCompletionModal();
                    }
                    else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(error.message);
                }
            }
        });
    }

    return (
        <ExaminationContext.Provider
            value={{
                questions,
                isPending,
                modals,
                answerStatus,
                livesAnimationVisible,
                examinationType,
                examinationSucceeded,
                codeFillAnswers,
                codeFillEvaluations,
                gainedXp,
                selectedChoices,
                currentQuestion,
                examinationTitle,
                correctChoiceIds,
                examinationState,
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
}
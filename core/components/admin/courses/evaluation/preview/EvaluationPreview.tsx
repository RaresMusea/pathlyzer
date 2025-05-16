"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEvaluation } from "@/hooks/useEvaluation";
import { FullLessonFormType } from "@/schemas/LessonCreatorSchema";
import { AnimationDirection, CodeFillQuestionDto, MultipleChoiceQuestionDto, SingleChoiceQuestionDto } from "@/types/types";
import { QuestionType } from "@prisma/client";
import { CheckCircle, XCircle } from "lucide-react";
import { useCallback, useState } from "react";

export const EvaluationPreview = () => {
    const { form } = useEvaluation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState<boolean>(false)
    const [direction, setDirection] = useState<AnimationDirection>(AnimationDirection.NONE);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const questions: FullLessonFormType["quiz"]["questions"] = form.watch("quiz.questions");

    const handleSingleChoiceAnswer = useCallback((questionId: string, optionId: string) => {
        setAnswers({
            ...answers,
            [questionId]: optionId
        });
    }, [setAnswers]);

    const handleMultiChoiceAnswer = useCallback((questionId: string, choiceId: string, checked: boolean) => {
        const currentAnswers = answers[questionId] || [];
        let newAnswers

        if (checked) {
            newAnswers = [...currentAnswers, choiceId];
        }
        else {
            newAnswers = currentAnswers.filter((id: string) => id !== choiceId);
        }

        setAnswers({
            ...answers,
            [questionId]: newAnswers
        })
    }, [setAnswers]);

    const handleCodeFillAnswer = useCallback((questionId: string, answerParts: string[]) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerParts,
        }));

    }, [setAnswers]);

    const navigateToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setDirection(AnimationDirection.FORWARDS);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        else {
            setShowResults(true);
        }
    }

    const navigateToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setDirection(AnimationDirection.BACKWARDS);
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    const reset = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
        setDirection(AnimationDirection.NONE);
    }

    const isSingleChoiceCorrect = (question: SingleChoiceQuestionDto, answerId: string) => {
        return question.choices.some(choice => choice.id === answerId && choice.isCorrect);
    };

    const isMultipleChoiceCorrect = (question: MultipleChoiceQuestionDto, answerIds: string[]) => {
        const correctOptionIds = question.choices.filter(c => c.isCorrect).map(c => c.id);
        const incorrectOptionIds = question.choices.filter(c => !c.isCorrect).map(c => c.id);

        const allCorrectSelected = correctOptionIds.every(id => answerIds.includes(id as string));
        const noIncorrectSelected = !incorrectOptionIds.some(id => answerIds.includes(id as string));

        return allCorrectSelected && noIncorrectSelected;
    };

    const isCodeFillCorrect = (question: CodeFillQuestionDto, userAnswer: string[]) => {
        const correctAnswer = question.codeSection.correct;
        return Array.isArray(userAnswer) &&
            userAnswer.length === correctAnswer.length &&
            userAnswer.every((token, i) => token.trim() === correctAnswer[i].trim());
    };

    const computeScore = () => {
        let correctAnswers = 0;

        questions.forEach((question) => {
            const qid = question.id;
            if (!qid) return;

            const userAnswer = answers[qid];

            switch (question.type) {
                case QuestionType.SINGLE:
                    if (isSingleChoiceCorrect(question as SingleChoiceQuestionDto, userAnswer)) {
                        correctAnswers++;
                    }
                    break;

                case QuestionType.MULTIPLE:
                    if (isMultipleChoiceCorrect(question as MultipleChoiceQuestionDto, userAnswer || [])) {
                        correctAnswers++;
                    }
                    break;

                case QuestionType.CODE_FILL:
                    if (isCodeFillCorrect(question as CodeFillQuestionDto, userAnswer)) {
                        correctAnswers++;
                    }
                    break;
            }
        });

        const total = questions.length;

        return {
            score: correctAnswers,
            total,
            percentage: total > 0 ? Math.round((correctAnswers / total) * 100) : 0,
        };
    };

    const renderSingleChoiceQuestion = (question: SingleChoiceQuestionDto) => {
        if (!question.id) {
            return null;
        }

        return (
            <div>
                <h3 className="text-lg font-medium mb-4">{question.prompt}</h3>
                <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleSingleChoiceAnswer(question.id as string, value)}
                    className="space-y-3"
                >
                    {question.choices.map((choice) => (
                        <div
                            key={choice.id}
                            className={`flex items-center space-x-2 border p-3 rounded-md ${showResults && choice.isCorrect ? "border-green-500 bg-green-50" : ""
                                } ${showResults && answers[question.id as string] === choice.id && !choice.isCorrect ? "border-red-500 bg-red-50" : ""
                                }`}
                        >
                            <RadioGroupItem value={choice.id as string} id={choice.id} disabled={showResults} />
                            <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                                {choice.text}
                            </Label>
                            {showResults && choice.isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {showResults && answers[question.id as string] === choice.id && !choice.isCorrect && (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </div>
                    ))}
                </RadioGroup>
            </div>
        )
    }

    const renderMultiChoiceQuestion = (question: MultipleChoiceQuestionDto) => {
        const selectedOptions = answers[question.id as string] || [];

        return (
            <div>
                <h3 className="text-lg font-medium mb-4">{question.prompt}</h3>
                <div className="space-y-3">
                    {question.choices.map((choice) => {
                        const isSelected = selectedOptions.includes(choice.id)

                        return (
                            <div
                                key={choice.id}
                                className={`flex items-center space-x-2 border p-3 rounded-md ${showResults && choice.isCorrect ? "border-green-500 bg-green-50" : ""
                                    } ${showResults && isSelected && !choice.isCorrect ? "border-red-500 bg-red-50" : ""}`}
                            >
                                <Checkbox
                                    id={choice.id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleMultiChoiceAnswer(question.id as string, choice.id as string, !!checked)}
                                    disabled={showResults}
                                />
                                <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                                    {choice.text}
                                </Label>
                                {showResults && choice.isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                                {showResults && isSelected && !choice.isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                            </div>
                        )
                    })}
                </div>

                {showResults && (
                    <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                        <p className="text-sm text-blue-700">
                            <strong>Notă:</strong> Pentru a primi punctaj complet, trebuie să selectezi toate răspunsurile corecte și
                            niciun răspuns incorect.
                        </p>
                    </div>
                )}
            </div>
        )
    }

    const renderCodeFillQuestion = (question: CodeFillQuestionDto) => {
        if (!question.codeSection.code || !question.id) return null;

        const parts = question.codeSection.code.split(/(~~.*?~~)/g);

        return (
            <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 text-xs border-b">
                    Code Completion
                </div>
                <div className="p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                        {parts.map((part, index) => {
                            if (part.startsWith("~~") && part.endsWith("~~")) {
                                const placeholder = part.substring(2, part.length - 2);
                                return (
                                    <span key={index} className="inline-block min-w-[100px] my-1">
                                        <Input
                                            className="font-mono h-7 px-2 py-1 text-xs"
                                            placeholder="Fill in the blank"
                                            defaultValue=""
                                        />
                                    </span>
                                );
                            }
                            return <span key={index}>{part}</span>;
                        })}
                    </pre>
                </div>
            </div>
        );
    };

    return (
        <div></div>
    )

}

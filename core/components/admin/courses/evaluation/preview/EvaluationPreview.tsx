"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEvaluation } from "@/hooks/useEvaluation";
import { FullLessonFormType } from "@/schemas/LessonCreatorSchema";
import { AnimationDirection, CodeFillQuestionDto, MultipleChoiceQuestionDto, SingleChoiceQuestionDto } from "@/types/types";
import { QuestionType } from "@prisma/client";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { NoQuestions } from "./NoQuestions";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getCodeFillLangLabelBasedOnValue } from "@/lib/LearningPathManagementUtils";

const animationVariants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }
    },
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => {
        return {
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }
    },
};

const transitionConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
}


export const EvaluationPreview = ({ goBack }: { goBack: () => void }) => {
    const { form, getEvaluationType } = useEvaluation();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState<boolean>(false)
    const [direction, setDirection] = useState<AnimationDirection>(AnimationDirection.NONE);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const theme: string = useTheme().theme || 'dark';

    const questions: FullLessonFormType["quiz"]["questions"] = form.watch("quiz.questions");

    const handleSingleChoiceAnswer = useCallback((questionId: string, optionId: string) => {
        setAnswers({
            ...answers,
            [questionId]: optionId
        });
    }, [setAnswers]);

    const handleMultiChoiceAnswer = useCallback(
        (questionId: string, choiceId: string, checked: boolean) => {
            setAnswers((prevAnswers) => {
                const currentAnswers = prevAnswers[questionId] || [];
                let newAnswers;

                if (checked) {
                    newAnswers = [...currentAnswers, choiceId];
                } else {
                    newAnswers = currentAnswers.filter((id: string) => id !== choiceId);
                }

                return {
                    ...prevAnswers,
                    [questionId]: newAnswers,
                };
            });
        },
        []
    );

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

        const blankCount = parts.filter((p) => p.startsWith("~~") && p.endsWith("~~")).length;

        const userAnswer = (answers[question.id] || Array(blankCount).fill("")) as string[];

        const handleChange = (index: number, value: string) => {
            const newAnswers = [...userAnswer];
            newAnswers[index] = value;
            handleCodeFillAnswer(question.id!, newAnswers);
        };

        let blankIndex = 0;

        return (
            <>
                <h3 className="text-lg font-medium mb-4">{question.prompt}</h3>
                <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted p-2 text-xs border-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs">
                                <Image className="mr-2" src={getLogoBasedOnTech(getCodeFillLangLabelBasedOnValue(question.codeSection.language), theme)} width={25} height={25} alt="Logo tech image" />
                                <span>{getCodeFillLangLabelBasedOnValue(question.codeSection.language)}</span>
                            </div>
                            <span>Code Completion</span>
                        </div>
                    </div>
                    <div className="p-4 bg-primary-foreground">
                        <pre className="font-mono text-sm whitespace-pre-wrap">
                            {parts.map((part, index) => {
                                if (part.startsWith("~~") && part.endsWith("~~")) {
                                    const currentIndex = blankIndex++;
                                    return (
                                        <span key={index} className="inline-block min-w-[100px] my-1">
                                            <Input
                                                className="font-mono h-7 px-2 py-1 text-xs"
                                                placeholder="Fill in the blank"
                                                value={userAnswer[currentIndex] || ""}
                                                onChange={(e) => handleChange(currentIndex, e.target.value)}
                                                disabled={showResults}
                                            />
                                        </span>
                                    );
                                }
                                return <span key={index}>{part}</span>;
                            })}
                        </pre>
                    </div>
                </div>
            </>
        );
    };

    if (questions.length === 0) {
        return (
            <NoQuestions />
        );
    }

    if (showResults) {
        const { score, total, percentage } = computeScore();

        return (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={transitionConfig}>
                <Card>
                    <CardHeader>
                        <CardTitle>Evaluation Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <div className="text-5xl font-bold mb-4">
                                {score}/{total}
                            </div>
                            <div className="text-2xl mb-6">{percentage}%</div>
                            <div
                                className={`text-lg font-medium ${percentage >= 70 ? "text-green-600" : percentage >= 40 ? "text-amber-600" : "text-red-600"
                                    }`}
                            >
                                {percentage >= 95
                                    ? "Well done! You've shown a strong understanding of the material"
                                    : percentage >= 40
                                        ? "Almost there! Let's try once again."
                                        : "Unfortunately, you'll need to practice more before taking this test once again."}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={reset}>Try again</Button>
                    </CardFooter>
                </Card>
            </motion.div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle><h1 className="text-2xl">{form.getValues('quiz.title')}</h1></CardTitle>
                <CardDescription>Preview {getEvaluationType()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-medium">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <div className="text-sm text-gray-500">
                            {Math.round((currentQuestionIndex / questions.length) * 100)}% completed
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <motion.div
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        ></motion.div>
                    </div>

                    <div className="relative overflow-hidden">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentQuestionIndex}
                                custom={direction}
                                variants={animationVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={transitionConfig}
                                className="w-full"
                            >
                                {questions[currentQuestionIndex].type === QuestionType.SINGLE
                                    ? renderSingleChoiceQuestion(questions[currentQuestionIndex] as SingleChoiceQuestionDto)
                                    : questions[currentQuestionIndex].type === QuestionType.MULTIPLE
                                        ? renderMultiChoiceQuestion(questions[currentQuestionIndex] as MultipleChoiceQuestionDto)
                                        : renderCodeFillQuestion(questions[currentQuestionIndex] as CodeFillQuestionDto)}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={navigateToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                            Back
                        </Button>
                        <Button onClick={navigateToNextQuestion}>
                            {currentQuestionIndex < questions.length - 1 ? "Next question" : "Finalize"}
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to editor
                </Button>
            </CardFooter>
        </Card>
    );
}

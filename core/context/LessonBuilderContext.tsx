"use client";

import { FullLessonFormType, FullLessonSchema } from "@/schemas/LessonCreatorSchema";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonDto } from "@/types/types";

interface LessonBuilderContextProps {
    currentStep: number;
    form: UseFormReturn<FullLessonFormType>;
    buttonOptions: string[]

    onSubmit: (values: FullLessonFormType) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
}

const LessonBuilderContext = createContext<LessonBuilderContextProps | undefined>(undefined);

export const LessonBuilderProvider: React.FC<{ children: React.ReactNode, lesson?: LessonDto }> = ({ children, lesson }) => {
    const buttonOptions: string[] = ['lesson details', 'lesson content', 'lesson quiz'];
    const [currentStep, setCurrentStep] = useState<number>(1);

    const form = useForm<FullLessonFormType>({
        resolver: zodResolver(FullLessonSchema),
        defaultValues: {
            details: lesson
                ? {
                    title: lesson.title,
                    description: lesson.description,
                }
                : {
                    title: "",
                    description: "",
                },
            content: {
                content: "",
            },
            quiz: {
                title: "",
                type: "LESSON_QUIZ",
                questions: [],
            },
        },
    });

    const onSubmit = async (values: FullLessonFormType) => {

    }

    const onPrevStep = useCallback(() => {
        setCurrentStep(Math.max(0, currentStep - 1));
    }, [currentStep]);

    const onNextStep = useCallback(async () => {
        switch (currentStep) {
            case 1:
                await validateLessonDetails();
                break;
            default:
                break;
        }
    }, [currentStep]);


    const validateLessonDetails = async () => {
        const isValid: boolean = await form.trigger(['details.title', 'details.description']);

        if (isValid) {
            setCurrentStep(2);
        }
    }

    return (
        <LessonBuilderContext.Provider value={{
            currentStep,
            form,
            buttonOptions,
            onSubmit,
            onNextStep,
            onPrevStep
        }}>
            {children}
        </LessonBuilderContext.Provider>
    )
}

export const useLessonBuilder = () => {
    const context = useContext(LessonBuilderContext);

    if (!context) {
        throw new Error("useLessonBuilder() must be used within a LessonBuilderProvider!");
    }

    return context;
};
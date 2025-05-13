"use client";

import { FullLessonFormType, FullLessonSchema } from "@/schemas/LessonCreatorSchema";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonDto } from "@/types/types";
import { useCourseBuilder } from "./CourseBuilderContext";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";

const BLANK_LESSON_CONTENT: string = '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"}}]}';

interface LessonBuilderContextProps {
    currentStep: number;
    form: UseFormReturn<FullLessonFormType>;
    buttonOptions: string[];
    editor: Editor | null;

    onSubmit: (values: FullLessonFormType) => void;
    onNextStep: () => void;
    onPrevStep: () => void;
}

const LessonBuilderContext = createContext<LessonBuilderContextProps | undefined>(undefined);

export const LessonBuilderProvider: React.FC<{ children: React.ReactNode, lesson?: LessonDto }> = ({ children, lesson }) => {
    const buttonOptions: string[] = ['lesson details', 'lesson content', 'lesson quiz'];
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { editor } = useCourseBuilder();

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
            case 2:
                validateLessonContent();
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

    const validateLessonContent = () => {
        const content = JSON.stringify(editor?.getJSON());

        if (content === BLANK_LESSON_CONTENT) {
            toast.error('The lesson content cannot be empty!');
        }
        else {
            form.setValue("content.content", content);
            setCurrentStep(3);
        }
    }

    return (
        <LessonBuilderContext.Provider value={{
            currentStep,
            form,
            buttonOptions,
            editor,
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
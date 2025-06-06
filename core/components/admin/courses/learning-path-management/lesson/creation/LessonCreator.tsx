"use client";

import { AnimatePresence } from "framer-motion";
import { LessonDetailsForm } from "./steps/LessonDetailsForm";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { Form } from "@/components/ui/form";
import { LessonFormNavigator } from "./LessonFormNavigator";
import { LessonContentCreator } from "./steps/LessonContentCreator";
import { EvaluationForm } from "./steps/EvaluationForm";
import { QuizType } from "@prisma/client";

export const LessonCreator = () => {
    const { currentStep, onSubmit, form } = useLessonBuilder();
    return (
        <div className="container mx-auto px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
                        <AnimatePresence mode="sync" initial={false}>
                            {currentStep === 1 && <LessonDetailsForm key="step1" />}
                            {currentStep === 2 && <LessonContentCreator key="step2" />}
                            {currentStep === 3 && <EvaluationForm key="step3" quizType={QuizType.LESSON_QUIZ} />}
                        </AnimatePresence>
                    </div>
                    <LessonFormNavigator />
                </form>
            </Form>
        </div>
    )
}
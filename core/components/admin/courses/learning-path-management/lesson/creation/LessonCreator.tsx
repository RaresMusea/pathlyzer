"use client";

import { AnimatePresence } from "framer-motion";
import { LessonDetailsForm } from "./steps/LessonDetailsForm";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { Form } from "@/components/ui/form";
import { LessonFormNavigator } from "./LessonFormNavigator";
import { LessonContentCreator } from "./steps/LessonContentCreator";

export const LessonCreator = () => {
    const { currentStep, onSubmit, form } = useLessonBuilder();
    return (
        <div className="container mx-auto px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="relative" style={{ minHeight: "400px" }}>
                        <AnimatePresence mode="wait" initial={false}>
                            {currentStep === 1 && <LessonDetailsForm key="step1" />}
                            {currentStep === 2 && <LessonContentCreator key="step2"/>}
                        </AnimatePresence>
                    </div>
                    <LessonFormNavigator />
                </form>
            </Form>
        </div>
    )
}
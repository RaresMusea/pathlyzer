"use client";

import { AnimatePresence } from "framer-motion";
import { CourseDetailsForm } from "./steps/CourseDetailsForm";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { Form } from "@/components/ui/form";
import { LessonFormNavigator } from "./LessonFormNavigator";

export const LessonCreator = () => {
    const { currentStep, onSubmit, form } = useLessonBuilder();
    return (
        <div className="container mx-auto py-10 px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
                        <AnimatePresence mode="wait" initial={false}>
                            {currentStep === 1 && <CourseDetailsForm />}
                        </AnimatePresence>
                    </div>
                    <LessonFormNavigator />
                </form>
            </Form>
        </div>
    )
}
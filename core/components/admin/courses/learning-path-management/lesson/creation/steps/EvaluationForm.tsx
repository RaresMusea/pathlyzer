"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizType } from "@prisma/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { EvaluationBuilder } from "../EvaluationBuilder";
import { EditingQuestionProvider } from "@/context/EditingQuestionContext";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationPreview } from "@/components/admin/courses/evaluation/preview/EvaluationPreview";

const getFormattedType = (quizType: QuizType): string => {
    return (quizType === QuizType.LESSON_QUIZ) ? 'Lesson quiz' : 'Exam';
}

export const EvaluationForm = ({ quizType }: { quizType: QuizType }) => {
    const [activeTab, setActiveTab] = useState<string>(`builder`);

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className="w-full"
        >
            <h4 className="text-lg my-3">Use the following quiz builder in order to provide lesson evaluation content.</h4>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid w-full lg:w-1/3 grid-cols-2">
                    <TabsTrigger value="builder">{getFormattedType(quizType)} builder</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <EditingQuestionProvider>
                    <TabsContent value="builder" className="mt-6">

                        <EvaluationBuilder evaluationType={getFormattedType(quizType)} setActiveTab={setActiveTab} />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-6">
                        <EvaluationPreview goBack={() => { setActiveTab('builder') }} />
                    </TabsContent>
                </EditingQuestionProvider>
            </Tabs>
        </motion.div>
    )
}
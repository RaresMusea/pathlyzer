"use client";

import { Button } from "@/components/ui/button";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { QuizType } from "@prisma/client";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle, Heart } from "lucide-react";
import { useTheme } from "next-themes";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}

export const ExaminationLandingModal = ({ type, onExit, onStart, openDialog }: { type: QuizType, onExit: () => void, onStart: () => void, openDialog: () => void }) => {

    const theme = useTheme().theme;
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col font-nunito transition-colors">
            <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                <motion.div
                    className="max-w-2xl w-full bg-[hsl(var(--card))] dark:bg-primary-foreground/50 text-[hsl(var(--card-foreground))] rounded-xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] py-6 px-8">
                        <h2 className="text-2xl font-bold text-white">Before starting the {getFormattedType(type).toLowerCase()}</h2>
                        <p className="text-white/80 mt-2">Review your knowledge and get ready to begin the assessment.</p>
                    </div>

                    <motion.div className="p-8" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                            <div className="bg-[hsl(var(--accent))] p-3 rounded-full">
                                <Heart className="h-6 w-6 text-[var(--pathlyzer-table-border)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Lives</h3>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    This platform uses a life system to keep learners engaged. Each incorrect answer costs you one life. If you lose all your lives, you'll fail the {getFormattedType(type).toLowerCase()}. You can regain lives by completing previous assessments.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Individual Completion</h3>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    You are encouraged to complete this quiz on your own, without external help or additional resources.
                                    The goal is to assess your personal understanding.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Question Types</h3>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    The quiz includes single-choice, multiple-choice, and code-completion questions.
                                    Make sure to read each question carefully before answering.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className="mb-8 flex items-start space-x-4" variants={itemVariants}>
                            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Stay Focused</h3>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    Take your time to think through each question. There is no time limit, so you can carefully consider your answers before selecting them.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <Button
                                onClick={onStart}
                                size="lg"
                                className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                            >
                                Take {getFormattedType(type).toLowerCase()}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    )
}
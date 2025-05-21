"use client";

import { Button } from "@/components/ui/button";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { QuizType } from "@prisma/client";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle, Heart } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
    },
};

export const ExaminationLandingModal = ({
    type,
    onStart,
}: {
    type: QuizType;
    onStart: () => void;
}) => {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col font-nunito transition-colors">
            <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center justify-center">
                <motion.div
                    className="max-w-2xl w-full bg-[hsl(var(--card))] dark:bg-primary-foreground/50 text-[hsl(var(--card-foreground))] rounded-xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] py-5 px-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                            Before starting the {getFormattedType(type).toLowerCase()}
                        </h2>
                        <p className="text-white/80 mt-1 text-sm sm:text-base">
                            Review your knowledge and get ready to begin the assessment.
                        </p>
                    </div>

                    <motion.div
                        className="p-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="mb-5 flex items-start space-x-4"
                            variants={itemVariants}
                        >
                            <div className="bg-[hsl(var(--accent))] p-2.5 rounded-full">
                                <Heart className="h-5 w-5 text-[var(--pathlyzer-table-border)]" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-1">Lives</h3>
                                <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                    This platform uses a life system to keep learners engaged. Each incorrect answer costs you one life. If you lose all your lives, you&apos;ll fail the {getFormattedType(type).toLowerCase()}. You can regain lives by completing previous assessments.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="mb-5 flex items-start space-x-4"
                            variants={itemVariants}
                        >
                            <div className="bg-yellow-100 dark:bg-yellow-900 p-2.5 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-1">
                                    Individual Completion
                                </h3>
                                <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                    You are encouraged to complete this quiz on your own, without external help or additional resources. The goal is to assess your personal understanding.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="mb-5 flex items-start space-x-4"
                            variants={itemVariants}
                        >
                            <div className="bg-green-100 dark:bg-green-900 p-2.5 rounded-full">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-1">
                                    Question Types
                                </h3>
                                <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                    The quiz includes single-choice, multiple-choice, and code-completion questions. Make sure to read each question carefully before answering.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="mb-6 flex items-start space-x-4"
                            variants={itemVariants}
                        >
                            <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-full">
                                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold mb-1">
                                    Stay Focused
                                </h3>
                                <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                    Take your time to think through each question. There is no time limit, so you can carefully consider your answers before selecting them.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ originX: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <Button
                                onClick={onStart}
                                size="lg"
                                className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white px-6 py-4 text-base rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                            >
                                Take {getFormattedType(type).toLowerCase()}
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

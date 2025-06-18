"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Clock,
    BookOpen,
    Heart,
    TrendingUp,
    Target,
} from "lucide-react";

interface PracticeLandingProps {
    onStart: () => void;
    onExit: () => void;
    remainingTime: number;
}

export default function LessonPracticeLandingModal({
    onStart,
    onExit,
    remainingTime,
}: PracticeLandingProps) {
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };


    return (
        <main className="flex-1 font-nunito container mx-auto px-4 py-8 flex flex-col items-center justify-center">
            <motion.div
                className="max-w-2xl w-full bg-[hsl(var(--card))] dark:bg-primary-foreground/50 text-[hsl(var(--card-foreground))] rounded-xl shadow-xl overflow-hidden border border-[hsl(var(--border))]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] py-6 px-8">
                    <h2 className="text-2xl font-bold text-white">Before starting practice</h2>
                    <p className="text-white/80 mt-2">
                        Learn how the life recovery and practice system works.
                    </p>
                </div>

                <motion.div
                    className="p-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                        <div className="bg-[hsl(var(--accent))] p-2.5 rounded-full">
                            <Heart className="h-5 w-5 text-[var(--pathlyzer-table-border)]" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Life Recovery</h3>
                            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Each minute of practice slightly reduces your 30 minutes cooldown. You can regain lives faster and retake the quiz once the cooldown ends.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                        <div className="bg-green-100 dark:bg-green-900 p-2.5 rounded-full">
                            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Educational Content</h3>
                            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Practice includes relevant learning materials from the lesson. Read each section carefully to strengthen your understanding.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                        <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-full">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Timed Progress</h3>
                            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Each section has a recommended reading time. Your progress is tracked automatically, and you'll know when you're eligible to return to the quiz.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="mb-6 flex items-start space-x-4" variants={itemVariants}>
                        <div className="bg-purple-100 dark:bg-purple-900 p-2.5 rounded-full">
                            <Target className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Clear Purpose</h3>
                            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Practice is not a test. It's a chance to reinforce concepts and regain lives by actively engaging with the material.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="mb-8 flex items-start space-x-4" variants={itemVariants}>
                        <div className="bg-yellow-100 dark:bg-yellow-900 p-2.5 rounded-full">
                            <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold mb-1">Multiple Benefits</h3>
                            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                                Alongside life regeneration, practice helps you better understand the topic and prepare more confidently for the actual quiz.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-gradient-to-r from-[hsl(var(--muted)/40)] to-[hsl(var(--accent)/30)] border border-[hsl(var(--border))] rounded-lg p-4 mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold mb-1 text-[hsl(var(--foreground))]">Current Status</h4>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    {remainingTime > 0 ? (
                                        <>
                                            Remaining time for life recovery:{" "}
                                            <span className="font-bold text-orange-600">{formatTime(remainingTime)}</span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-green-700">You're ready to retry the quiz!</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                                <span className="ml-2 text-2xl font-bold text-[hsl(var(--foreground))]">+1</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <Button
                            onClick={onStart}
                            size="lg"
                            className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <BookOpen className="h-5 w-5 mr-2" />
                            Start Practice
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    );
}
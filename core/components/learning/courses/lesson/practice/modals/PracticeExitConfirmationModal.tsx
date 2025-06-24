"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BookOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const PracticeExitConfirmationModal = ({ handler }: { handler: (openState: boolean) => void }) => {
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const handleConfirmExit = () => {
        setIsVisible(false);
        setTimeout(() => {
            handler(false);
            router.push('..'); //TODO Change this later
        }, 300);
    }

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => { handler(false) }, 300);
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed font-nunito inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] py-6 px-8 text-center">
                            <motion.div
                                initial={{ rotate: 0, scale: 0.8 }}
                                animate={{ rotate: [0, -10, 10, -10, 0], scale: 1 }}
                                transition={{ duration: 0.7, times: [0, 0.25, 0.5, 0.75, 1] }}
                            >
                                <AlertTriangle className="h-10 w-10 text-white mx-auto" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mt-2">Leaving the practice?</h2>
                            <p className="text-blue-100 mt-1">Your progress will be lost.</p>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <StudyingCharacterAnimation />
                            </div>

                            <motion.div
                                className="text-center mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="text-xl font-semibold mb-4">Are you sure you want to exit?</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Practice helps reinforce knowledge and allows you to recover lives for quizzes. If you leave now,
                                    you’ll have to start over.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                                        <span className="font-medium text-blue-800 dark:text-blue-300">Practice benefits</span>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-200">
                                        Reinforce your knowledge and recover lives faster to continue your quiz!
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-700" onClick={handleCancel}>
                                    Continue Practice
                                </Button>
                                <Button variant="destructive" className="flex-1" onClick={handleConfirmExit}>
                                    Exit Practice
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function StudyingCharacterAnimation() {
    return (
        <div className="relative w-32 h-32">
            <motion.div
                 className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-950"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />

            <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.div
                    className="w-16 h-16 bg-amber-200 rounded-full border-2 border-amber-300 flex items-center justify-center relative"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                >
                    <div className="flex space-x-3">
                        <motion.div
                            className="w-2 h-2 bg-gray-800 rounded-full"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-gray-800 rounded-full"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                        />
                    </div>

                    <motion.div
                        className="absolute -top-8 -right-4"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 1 }}
                    >
                        <div className="bg-white rounded-full p-1 shadow-md">
                            <BookOpen className="h-3 w-3 text-blue-600" />
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i / 4) * Math.PI * 2
                const radius = 45
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1, 0],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            delay: i * 0.5,
                        }}
                    >
                        <div className="w-4 h-3 bg-blue-500 rounded-sm shadow-sm" />
                    </motion.div>
                )
            })}

            <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            />
        </div>
    )
}
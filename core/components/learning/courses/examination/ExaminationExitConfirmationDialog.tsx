"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export const ExaminationExitConfirmationDialog = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => {
    const [isVisible, setIsVisible] = useState(true)

    const handleConfirm = () => {
        setIsVisible(false)
        setTimeout(() => {
            onConfirm()
        }, 300)
    }

    const handleCancel = () => {
        setIsVisible(false)
        setTimeout(() => {
            onCancel()
        }, 300)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-nunito"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-xl shadow-xl dark:shadow-lg max-w-md w-full"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                    className="relative"
                                >
                                    <div className="w-24 h-24 bg-amber-100 dark:bg-yellow-300/20 rounded-full flex items-center justify-center">
                                        <SadFaceAnimation />
                                    </div>
                                    <motion.div
                                        className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-400 rounded-full p-1"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h2 className="text-xl font-bold text-center mb-2">Are you sure you want to exit?</h2>
                                <p className="text-[hsl(var(--muted-foreground))] text-center mb-6">
                                    If you leave the quiz now, your progress will not be saved and you’ll have to start over.
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    variant="outline"
                                    className="flex-1 border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-transparent hover:bg-[hsl(var(--muted))]"
                                    onClick={handleCancel}
                                >
                                    Continue quiz
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={handleConfirm}
                                >
                                    Leave the quiz
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

            )}
        </AnimatePresence>
    )
}

function SadFaceAnimation() {
    return (
        <motion.svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.circle cx="30" cy="30" r="28" fill="#FFC107" />

            <motion.circle
                cx="20"
                cy="25"
                r="4"
                fill="#5D4037"
                initial={{ y: 0 }}
                animate={{ y: [0, 1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "reverse" }}
            />

            <motion.circle
                cx="40"
                cy="25"
                r="4"
                fill="#5D4037"
                initial={{ y: 0 }}
                animate={{ y: [0, 1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "reverse" }}
            />

            <motion.path
                d="M20 42C20 42 25 36 30 36C35 36 40 42 40 42"
                stroke="#5D4037"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            />

            <motion.path
                d="M18 32C18 32 16 36 18 38"
                stroke="#64B5F6"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
            />
            <motion.circle
                cx="18"
                cy="38"
                r="2"
                fill="#64B5F6"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ delay: 1.5, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            />
        </motion.svg>
    )
}
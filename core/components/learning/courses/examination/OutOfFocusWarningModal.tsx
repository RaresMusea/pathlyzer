"use client";

import { Button } from "@/components/ui/button";
import { useExamination } from "@/context/ExaminationContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export const OutOfFocusWarningModal = () => {
    const { examinationTitle, closeOutOfFocusModal, getSimplifiedExaminationType } = useExamination();
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);

        setTimeout(() => {
            closeOutOfFocusModal()
        }, 300);
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 font-nunito"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-background rounded-xl shadow-2xl overflow-hidden max-w-md w-full border border-border"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-6 px-8 text-center">
                            <motion.div
                                initial={{ rotate: -5, scale: 0.8 }}
                                animate={{ rotate: [0, -5, 5, -5, 0], scale: 1 }}
                                transition={{ duration: 0.5, times: [0, 0.25, 0.5, 0.75, 1] }}
                            >
                                <AlertTriangle className="h-10 w-10 text-white mx-auto" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mt-2">Attention</h2>
                            <p className="text-white/90 mt-1">We&apos;ve noticed that you left the quiz.</p>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-center mb-6">
                                <BrowserSwitchingAnimation examinationMode={getSimplifiedExaminationType()} examinationTitle={examinationTitle} />
                            </div>

                            <motion.div
                                className="text-center mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-xl font-semibold mb-4 text-foreground">
                                    Looking up answers elsewhere won&apos;t help you!
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Searching for answers in other tabs or windows doesn&apos;t contribute to real knowledge retention.
                                    The quiz is designed to test what you&apos;ve already learned.
                                </p>
                                <p className="text-muted-foreground font-medium">
                                    Try to answer based on your current knowledge.<br/> It&apos;s much more beneficial for long-term learning!
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                <Button
                                    onClick={handleClose}
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                                    size="lg"
                                >
                                    Got it, continue the quiz
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function BrowserSwitchingAnimation({ examinationTitle, examinationMode }: { examinationTitle: string, examinationMode: string }) {
    return (
        <div className="relative w-64 h-48">
            <motion.div
                className="absolute left-0 top-0 w-40 h-32 bg-white rounded-lg border-2 border-gray-300 shadow-md overflow-hidden"
                initial={{ x: 0, rotate: 0 }}
                animate={{ x: [-5, 5, -5], rotate: [-1, 1, -1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, repeatType: "loop" }}
            >
                <div className="h-6 bg-gray-100 border-b border-gray-300 flex items-center px-2">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-600 mx-auto">{examinationMode}</div>
                </div>

                <div className="p-2">
                    <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="flex flex-col space-y-1.5">
                        <div className="w-full h-4 bg-blue-100 rounded border border-blue-300"></div>
                        <div className="w-full h-4 bg-gray-100 rounded border border-gray-300"></div>
                        <div className="w-full h-4 bg-gray-100 rounded border border-gray-300"></div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute right-0 top-0 w-40 h-32 bg-white rounded-lg border-2 border-gray-300 shadow-md overflow-hidden"
                initial={{ x: 0, rotate: 0, zIndex: 10 }}
                animate={{
                    x: [5, -5, 5],
                    rotate: [1, -1, 1],
                    zIndex: 10,
                }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, repeatType: "loop" }}
            >
                <div className="h-6 bg-gray-100 border-b border-gray-300 flex items-center px-2">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-600 mx-auto">Search</div>
                </div>

                <div className="p-2">
                    <div className="w-full h-5 bg-gray-100 rounded border border-gray-300 mb-2 flex items-center px-2">
                        <div className="text-xs text-gray-400 truncate">{examinationTitle}...</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="w-full h-3 bg-gray-200 rounded"></div>
                        <div className="w-full h-3 bg-gray-200 rounded"></div>
                        <div className="w-full h-3 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                initial={{ y: 0 }}
                animate={{ y: [0, -3, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "loop" }}
            >
                <motion.div
                    className="w-18 h-18 bg-amber-200 rounded-full border-2 border-amber-300 flex items-center justify-center"
                    style={{ width: "4.5rem", height: "4.5rem" }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "loop" }}
                >
                    <div className="flex space-x-5">
                        <motion.div
                            className="w-3 h-3 bg-gray-800 rounded-full"
                            animate={{ y: [-1, 1, -1] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, repeatType: "loop" }}
                        />
                        <motion.div
                            className="w-3 h-3 bg-gray-800 rounded-full"
                            animate={{ y: [-1, 1, -1] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, repeatType: "loop" }}
                        />
                    </div>

                    <motion.div
                        className="absolute -right-1 top-3 w-2 h-2 bg-blue-400 rounded-full"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: [0, 10, 20] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "loop" }}
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-16 left-1/2 transform -translate-x-1/2 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "loop", delay: 0.5 }}
            >
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M0 10H40M40 10L30 5M40 10L30 15"
                        stroke="#FF5722"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>
            </motion.div>

            <motion.div
                className="absolute top-16 left-1/2 transform -translate-x-1/2 rotate-180 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, repeatType: "loop", delay: 1.5 }}
            >
                <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M0 10H40M40 10L30 5M40 10L30 15"
                        stroke="#FF5722"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>
            </motion.div>
        </div>
    )
}
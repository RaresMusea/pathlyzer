"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import Lottie from "lottie-react";

import learningPathsAnimation from "@/resources/lottie/onboarding/learning-paths.json";
import evaluationAnimation from "@/resources/lottie/onboarding/evaluation.json";
import gamificationAnimation from "@/resources/lottie/onboarding/gamification.json";
import codeEditorAnimation from "@/resources/lottie/onboarding/code-editor.json";
import rewardsAnimation from "@/resources/lottie/onboarding/rewards.json";

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [direction, setDirection] = useState<number>(0);

    const steps = [
        {
            title: "Learning Paths",
            description:
                "Parcurge cursuri personalizate pentru a învăța și aprofunda tehnologii și limbaje de programare moderne.",
            animation: learningPathsAnimation,
            color: "from-blue-500 to-purple-600",
            bgColor: "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
        },
        {
            title: "Evaluation",
            description: "La finalul fiecărui curs sau unitate, verifică-ți cunoștințele prin teste interactive de evaluare.",
            animation: evaluationAnimation,
            color: "from-green-500 to-teal-600",
            bgColor: "bg-gradient-to-br from-green-500/20 to-teal-600/20",
        },
        {
            title: "Gamificare",
            description:
                "Răspunsurile corecte sunt recompensate cu 'vieți', iar cele greșite penalizate. Recompleteaza cursurile pentru a-ți reface viețile.",
            animation: gamificationAnimation,
            color: "from-red-500 to-orange-600",
            bgColor: "bg-gradient-to-br from-red-500/20 to-orange-600/20",
        },
        {
            title: "Code Editor Cloud",
            description:
                "Editorul nostru de cod bazat pe cloud integrează tot pachetul într-un singur loc, fără configurații adiționale.",
            animation: codeEditorAnimation,
            color: "from-indigo-500 to-blue-600",
            bgColor: "bg-gradient-to-br from-indigo-500/20 to-blue-600/20",
        },
        {
            title: "Rewards & Leaderboard",
            description:
                "Un mediu competitiv cu recompense, clasamente și un leaderboard care te încurajează să rămâi implicat în procesul educațional.",
            animation: rewardsAnimation,
            color: "from-purple-500 to-pink-600",
            bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-600/20",
        },
    ]

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setDirection(1)
            setCurrentStep((prev) => prev + 1)
        } else {
            onClose()
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1)
            setCurrentStep((prev) => prev - 1)
        }
    }

    const skipOnboarding = () => {
        onClose()
    }

    // Animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
        }),
    }

    const animationVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
        exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } },
    }

    const backgroundVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } },
    }

    const floatingElements = [
        { size: 20, delay: 0, duration: 4, x: -30, y: -40 },
        { size: 15, delay: 1, duration: 5, x: 40, y: -30 },
        { size: 25, delay: 2, duration: 6, x: -20, y: 50 },
        { size: 18, delay: 0.5, duration: 7, x: 50, y: 40 },
        { size: 12, delay: 1.5, duration: 5, x: 20, y: -50 },
    ]

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            >
                {/* Close button */}
                <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={onClose}>
                    <X className="h-5 w-5" />
                </Button>

                <div className="flex flex-col md:flex-row h-[80vh] max-h-[600px]">
                    {/* Animation side */}
                    <div className="w-full md:w-1/2 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`bg-${currentStep}`}
                                variants={backgroundVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className={`absolute inset-0 ${steps[currentStep].bgColor}`}
                            />
                        </AnimatePresence>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`animation-${currentStep}`}
                                    variants={animationVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className={`relative w-full max-w-[300px] max-h-[300px] z-10`}
                                >
                                    {/* Floating elements */}
                                    {floatingElements.map((el, i) => (
                                        <motion.div
                                            key={`float-${currentStep}-${i}`}
                                            className={`absolute rounded-full bg-gradient-to-br ${steps[currentStep].color} opacity-70`}
                                            style={{ width: el.size, height: el.size }}
                                            animate={{
                                                x: [el.x, -el.x, el.x],
                                                y: [el.y, -el.y, el.y],
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 180, 360],
                                            }}
                                            transition={{
                                                duration: el.duration,
                                                delay: el.delay,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: "reverse",
                                            }}
                                        />
                                    ))}

                                    {/* Main animation */}
                                    <div className="relative z-20">
                                        <motion.div
                                            className={`p-8 rounded-full bg-gradient-to-br ${steps[currentStep].color} shadow-lg`}
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                rotate: [0, 5, 0, -5, 0],
                                            }}
                                            transition={{
                                                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                                                rotate: { duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                                            }}
                                        >
                                            <Lottie animationData={steps[currentStep].animation} loop={true} />
                                        </motion.div>
                                    </div>

                                    {/* Decorative rings */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-full border-4 border-white/20 -z-10`}
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                                    />
                                    <motion.div
                                        className={`absolute inset-0 rounded-full border-2 border-white/10 -z-10`}
                                        animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.3, 0.1, 0.3] }}
                                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Animated background patterns */}
                        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Content side */}
                    <div className="w-full md:w-1/2 p-6 pt-12 flex flex-col">
                        {/* Progress bar - now only in the right half */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                                <span>
                                    Pasul {currentStep + 1} din {steps.length}
                                </span>
                                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                            </div>
                            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-1.5" />
                        </div>

                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                className="flex-1 flex flex-col justify-center"
                            >
                                <h2 className="text-3xl font-bold mb-4">{steps[currentStep].title}</h2>
                                <p className="text-lg text-gray-700 mb-8">{steps[currentStep].description}</p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation buttons */}
                        <div className="flex justify-between mt-auto pt-4">
                            <div>
                                {currentStep > 0 && (
                                    <Button variant="outline" onClick={prevStep}>
                                        Înapoi
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {currentStep < steps.length - 1 ? (
                                    <>
                                        <Button variant="ghost" onClick={skipOnboarding}>
                                            Sari peste
                                        </Button>
                                        <Button onClick={nextStep}>Continuă</Button>
                                    </>
                                ) : (
                                    <Button onClick={onClose}>Începe să înveți</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

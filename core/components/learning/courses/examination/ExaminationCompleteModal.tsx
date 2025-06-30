"use client";

import { useEffect, useRef, useState } from "react";
import { getXpThreshold } from "@/lib/UserUtils";
import { motion } from "framer-motion";
import { ConfettiFireworks } from "@/components/misc/animations/ConfettiFireworks";
import { Button } from "@/components/ui/button";
import { Award, Heart, Star, TrendingUp } from "lucide-react";
import { QuizType } from "@prisma/client";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { playSound } from "@/lib/AudioUtils";
import { EXAMINATION_COMPLETE_AUDIO, LEVEL_UP_AUDIO } from "@/exporters/AudioExporter";

interface ExaminationCompleteModalProps {
    currentXp: number;
    isLastLesson: boolean;
    currentLevel: number;
    onClose: () => void;
    examinationType: QuizType;
    prevStats: { xp: number; level: number };
}

export const ExaminationCompleteModal = ({
    isLastLesson,
    currentXp,
    examinationType,
    prevStats,
    onClose
}: ExaminationCompleteModalProps) => {
    const initialXp = prevStats.xp;
    const initialLevel = prevStats.level;
    const xpGained = currentXp - initialXp;

    const [displayXp, setDisplayXp] = useState(initialXp);
    const [displayLevel, setDisplayLevel] = useState(initialLevel);
    const [progress, setProgress] = useState(() =>
        calculateProgress(initialXp, initialLevel)
    );
    const [showLevelUpEffect, setShowLevelUpEffect] = useState(false);
    const [triggerConfetti, setTriggerConfetti] = useState(false);
    const animationStarted = useRef(false);

    function calculateProgress(xp: number, level: number): number {
        const current = getXpThreshold(level);
        const next = getXpThreshold(level + 1);
        return Math.max(0, Math.min(1, (xp - current) / (next - current)));
    }

    useEffect(() => {
        if (animationStarted.current) return;
        animationStarted.current = true;

        playSound(EXAMINATION_COMPLETE_AUDIO);
        setTriggerConfetti(true);

        setTimeout(() => {
            let xp = initialXp;
            let lvl = initialLevel;
            const isLevelingUp = { current: false }; // folosește obiect ca să nu retrigger UI

            const interval = setInterval(() => {
                if (xp >= currentXp) {
                    clearInterval(interval);
                    return;
                }

                if (isLevelingUp.current) return;

                xp += 5;
                if (xp > currentXp) xp = currentXp;

                const currentLevelXp = getXpThreshold(lvl);
                const nextLevelXp = getXpThreshold(lvl + 1);

                if (xp >= nextLevelXp) {
                    isLevelingUp.current = true;

                    setProgress(1);

                    setTimeout(() => {
                        lvl++;
                        playSound(LEVEL_UP_AUDIO);
                        setDisplayLevel(lvl);
                        setShowLevelUpEffect(true);

                        setProgress(0);

                        setTimeout(() => {
                            setShowLevelUpEffect(false);
                            isLevelingUp.current = false;
                        }, 1200);
                    }, 400);

                    return;
                }

                setDisplayXp(xp);
                setDisplayLevel(lvl);

                const newProgress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
                setProgress(Math.max(0, Math.min(1, newProgress)));
            }, 20);
        }, 1000);
    }, []);


    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center font-nunito justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ConfettiFireworks trigger={triggerConfetti} duration={6000} />

            <motion.div
                className="relative z-10 bg-white dark:bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 dark:border-zinc-700 overflow-hidden max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            >
                <div className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] py-6 px-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                        <Award className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
                    <p className="text-blue-100 mt-1">
                        You have successfully completed this {getFormattedType(examinationType).toLowerCase()}
                    </p>
                </div>

                <div className="p-8">
                    <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
                            >
                                <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                        ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-center text-foreground">
                        Impressive! Your knowledge stands out!
                    </h3>
                    <p className="text-muted-foreground text-center text-sm mb-3">
                        Continue growing and mastering the craft of software engineering.
                    </p>

                    <motion.div
                        className="bg-gray-50 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg p-5 relative overflow-hidden mb-6 border border-gray-200/50 dark:border-zinc-700"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <div className="bg-purple-100 dark:bg-zinc-700 p-2 rounded-full mr-3">
                                    <TrendingUp className="h-5 w-5 text-[var(--pathlyzer-table-border)]" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Level</p>
                                    <p className="font-bold text-lg text-foreground">{displayLevel}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground text-right">XP Reward</p>
                                    <p className="font-bold text-lg text-right text-foreground">+{xpGained} XP</p>
                                </div>
                                <div className="bg-[var(--pathlyzer)] text-white text-xs font-bold px-2 py-1 rounded ml-3">
                                    +{xpGained}
                                </div>
                            </div>
                        </div>

                        <div className="h-6 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)]"
                                style={{ width: `${progress * 100}%` }}
                                animate={{ width: `${progress * 100}%` }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}

                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xs font-medium text-white">
                                    {Math.max(0, displayXp - getXpThreshold(displayLevel))} / {getXpThreshold(displayLevel + 1) - getXpThreshold(displayLevel)} XP
                                </p>
                            </div>
                        </div>

                        {showLevelUpEffect && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.9 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="text-center"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="text-4xl font-bold text-white mb-2 animate-bounce">LEVEL UP!</div>
                                    <div className="text-xl text-white">Level {displayLevel}</div>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>

                    {isLastLesson &&
                        <motion.div
                            className="bg-gray-50 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg p-5 relative overflow-hidden mb-6 border border-gray-200/50 dark:border-zinc-700"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.5 }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <div className="bg-red-200 dark:bg-red-400 p-2 rounded-full mr-3">
                                        <Heart className="h-5 w-5 text-[var(--pathlyzer-table-border)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Lives restored</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground text-right">Lives Reward</p>
                                        <p className="font-bold text-lg text-right text-foreground">5 lives</p>
                                    </div>
                                    <div className="bg-red-500 dark:bg-red-600 text-white text-xs font-bold px-2 py-1 rounded ml-3">
                                        +5 <Heart className="inline h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    }

                    <div className="flex justify-center">
                        <Button
                            onClick={onClose}
                            size="lg"
                            className="bg-gradient-to-r from-[var(--pathlyzer-table-border)] to-[var(--pathlyzer)] text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all duration-300 hover:shadow-lg w-full"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

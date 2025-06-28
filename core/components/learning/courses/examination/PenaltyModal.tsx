"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/TimeUtils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, Ban, BookOpen, Clock, Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PenaltyModal = ({ onClose }: { onClose: () => void }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [showAnimation, setShowAnimation] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 1 hour
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0 || showAnimation) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, showAnimation]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
            const parts = pathname.split("/");
            const courseId = parts[3];
            const lessonId = parts[5];
            router.push(`/learning/courses/${courseId}/lesson/${lessonId}`);
        }, 300);
    };

    const progressPercentage = ((60 * 60 - timeLeft) / (60 * 60)) * 100;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="font-nunito fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
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
                        <div className="bg-gradient-to-r from-red-600 to-red-800 py-6 px-8 text-center">
                            <motion.div
                                initial={{ rotate: 0, scale: 0.8 }}
                                animate={{ rotate: [0, -10, 10, -10, 0], scale: 1 }}
                                transition={{ duration: 0.7, times: [0, 0.25, 0.5, 0.75, 1] }}
                            >
                                <AlertOctagon className="h-10 w-10 text-white mx-auto" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mt-2">Penalty!</h2>
                            <p className="text-red-100 dark:text-red-200 mt-1">
                                You exited the quiz too many times.
                            </p>
                        </div>

                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {showAnimation ? (
                                    <motion.div
                                        key="animation"
                                        className="flex justify-center mb-6"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <CountdownExplosionAnimation />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="penalty-details"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="flex justify-center mb-6">
                                            <PenaltyTimerDisplay timeLeft={timeLeft} totalTime={60 * 60} />
                                        </div>

                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-semibold mb-4 dark:text-white">
                                                Fraud penalty
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                You left the quiz 3 times, indicating possible cheating
                                                attempts. This behavior is not allowed and has been
                                                penalized.
                                            </p>

                                            <div className="bg-muted border border-red-400 dark:border-red-600 rounded-lg p-4 mb-4">
                                                <div className="grid grid-cols-1 gap-3 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <Heart className="h-5 w-5 text-red-500 mr-2" />
                                                        <span className="font-medium text-red-700 dark:text-red-300">
                                                            All lives lost
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <Clock className="h-5 w-5 text-orange-500 mr-2" />
                                                        <span className="font-medium text-orange-700 dark:text-orange-300">
                                                            Cooldown: {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-center">
                                                        <Ban className="h-5 w-5 text-gray-500 mr-2" />
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                                            Practice disabled
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {timeLeft > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                                        <span>Penalty progress</span>
                                                        <span>{Math.round(progressPercentage)}%</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: `${progressPercentage}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-600 rounded-lg p-4">
                                                <div className="flex items-center justify-center mb-2">
                                                    <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300 mr-2" />
                                                    <span className="font-medium text-amber-800 dark:text-amber-200">
                                                        Active restrictions
                                                    </span>
                                                </div>
                                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                                    During this penalty, you cannot use practice mode to
                                                    reduce waiting time. You'll need to wait{" "}
                                                    {timeLeft > 0 ? formatTime(timeLeft) : "0:00"} to regain
                                                    a life.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: showAnimation ? 0.7 : 0.3 }}
                            >
                                <Button
                                    onClick={handleClose}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    size="lg"
                                    disabled={showAnimation}
                                >
                                    {timeLeft > 0 ? "Back to lesson" : "Retry quiz"}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


function PenaltyTimerDisplay({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
    const progress = ((totalTime - timeLeft) / totalTime) * 100

    return (
        <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="6" fill="none" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#EF4444"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100) }}
                    transition={{ duration: 0.5 }}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    className="text-xl font-bold text-red-600"
                    animate={{ scale: timeLeft % 60 === 0 && timeLeft > 0 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {Math.floor(timeLeft / 60)}
                </motion.div>
                <div className="text-xs text-gray-500">{Math.floor(timeLeft / 60) === 1 ? "min" : "min"}</div>
            </div>

            {/* Penalty icon */}
            <motion.div
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            >
                <Ban className="h-4 w-4 text-white" />
            </motion.div>
        </div>
    )
}

function CountdownExplosionAnimation() {
    return (
        <div className="relative w-64 h-48">
            <motion.div
                className="absolute left-1/2 top-1/2 w-40 h-40 bg-gray-900 rounded-full"
                style={{ marginLeft: "-80px", marginTop: "-80px" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            />

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">5</span>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1, delay: 1, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">4</span>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1, delay: 2, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">3</span>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1, delay: 3, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">2</span>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1, delay: 4, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">1</span>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-0 w-full h-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.8, delay: 5, times: [0, 0.2, 0.8, 1] }}
                >
                    <span className="text-6xl font-bold text-red-500">0</span>
                </motion.div>
            </div>

            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="relative"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 * i, duration: 0.5 }}
                    >
                        <HeartBreakAnimation delay={1 * i} />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3], opacity: [0, 1, 0] }}
                transition={{ duration: 1, delay: 5.8 }}
            >
                <div className="w-20 h-20 bg-red-500 rounded-full" />
            </motion.div>

            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const x = Math.cos(angle) * 100
                const y = Math.sin(angle) * 100

                return (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full"
                        style={{ marginLeft: "-1px", marginTop: "-1px" }}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                            x: [0, x],
                            y: [0, y],
                            opacity: [0, 1, 0],
                            scale: [1, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 5.8,
                            times: [0, 0.2, 1],
                        }}
                    />
                )
            })}

            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, delay: 5.8 }}
            >
                <svg width="100%" height="100%" viewBox="0 0 264 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 5.8 }}>
                        <path d="M132 74 L20 20" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L50 10" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L80 5" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L110 8" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L150 5" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L180 8" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L210 15" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L240 30" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L20 74" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L244 74" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L20 120" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L50 130" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L80 140" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L110 143" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L150 143" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L180 140" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L210 130" stroke="white" strokeWidth="1" />
                        <path d="M132 74 L240 120" stroke="white" strokeWidth="1" />
                    </motion.g>
                </svg>
            </motion.div>

            <motion.div
                className="absolute inset-0 bg-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.8, delay: 6, times: [0, 0.2, 1] }}
            />
        </div>
    )
}

function HeartBreakAnimation({ delay = 0 }) {
    return (
        <div className="w-12 h-12 relative">
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 1 + delay }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="#EF4444"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </motion.div>

            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, delay: 1 + delay, times: [0, 0.3, 1] }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="#EF4444"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    <motion.path
                        d="M12 5.67 L12 18"
                        stroke="white"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 1 + delay }}
                    />
                    <motion.path
                        d="M10 8 L14 12"
                        stroke="white"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 1.2 + delay }}
                    />
                    <motion.path
                        d="M14 8 L10 12"
                        stroke="white"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 + delay }}
                    />
                </svg>
            </motion.div>

            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 1.5 + delay, times: [0, 0.2, 1] }}
            >
                <div className="relative w-full h-full">
                    <motion.div
                        className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -20, rotate: -20 }}
                        transition={{ duration: 1, delay: 1.5 + delay }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="200%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="#EF4444"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-0 w-1/2 h-full overflow-hidden"
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 20, rotate: 20 }}
                        transition={{ duration: 1, delay: 1.5 + delay }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="200%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="#EF4444"
                            stroke="#EF4444"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginLeft: "-100%" }}
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
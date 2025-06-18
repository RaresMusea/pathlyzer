"use client";

import { Button } from "@/components/ui/button";
import { useExamination } from "@/context/ExaminationContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const OutOfLivesModal = ({ remainingTime }: { remainingTime: number }) => {
    const [isVisible, setIsVisible] = useState(true);
    const { closeOutOfLivesModal } = useExamination();
    const [showLifeRegenerationAnimation, setShowLifeRegenerationAnimation] = useState(false);
    const [showHeartAnimation, setShowHeartAnimation] = useState(true);
    const [canPractice, setCanPractice] = useState(false);
    const [timeLeft, setTimeLeft] = useState(remainingTime);
    const theme = useTheme().theme;
    const pathname = usePathname();

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            closeOutOfLivesModal();
        }, 500);
    };

    useEffect(() => {
        const wasLifeGranted = async () => {
            try {
                const segments = pathname.split('/');
                const courseId = segments[3];
                const lessonId = segments[5];

                if (!courseId || !lessonId) return;

                const response = await axios.get(`/api/courses/${courseId}/lessons/${lessonId}/life-granted`);
                if (response.status === 200 && typeof response.data.wasLifeGranted === 'boolean') {
                    setCanPractice(!(response.data.wasLifeGranted));
                }
            } catch (error) {
                console.error("Failed to check life granted:", error);
            }
        };

        if (pathname) {
            wasLifeGranted();
        }
    }, [pathname, setCanPractice]);

    useEffect(() => {
        setTimeLeft(remainingTime);
    }, [remainingTime]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setShowLifeRegenerationAnimation(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeartAnimation(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (showLifeRegenerationAnimation) {
            const timer = setTimeout(() => {
                setShowLifeRegenerationAnimation(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [showLifeRegenerationAnimation]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const progressPercentage = remainingTime > 0 ? ((remainingTime - timeLeft) / remainingTime) * 100 : 100;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex font-nunito items-center justify-center p-4 backdrop-blur-sm bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-background rounded-xl shadow-2xl overflow-hidden max-w-md w-full border border-border relative"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-gradient-to-r from-red-500 to-red-600 py-6 px-8 text-center">
                            <h2 className="text-2xl font-bold text-white">You&apos;re out of lives!</h2>
                            <p className="text-red-100 dark:text-red-200 mt-1">
                                Wait or use practice mode to regenerate a life.
                            </p>
                        </div>

                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {showHeartAnimation ? (
                                    <motion.div
                                        key="heart-animation"
                                        className="flex justify-center mb-8"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <HeartsAnimation theme={theme as string} />
                                    </motion.div>
                                ) : showLifeRegenerationAnimation ? (
                                    <motion.div
                                        key="life-regeneration"
                                        className="flex justify-center mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <LifeRegenAnimation />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="recovery-options"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center mb-4">
                                                <TimerDisplay timeLeft={timeLeft} totalTime={remainingTime} />
                                            </div>

                                            <h3 className="text-xl font-semibold mb-2 dark:text-white">Recover a life!</h3>
                                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                {timeLeft > 0 ? (
                                                    <>
                                                        You can wait{" "}
                                                        <span className="font-bold text-orange-600">{formatTime(timeLeft)}</span>
                                                        {canPractice && " or use Practice mode to reduce the time."}
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-green-600">You can retake the quiz now!</span>
                                                )}
                                            </p>

                                            {canPractice && timeLeft > 0 && (
                                                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-600 rounded-lg p-4 mb-4">
                                                    <div className="flex items-center justify-center mb-2">
                                                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300 mr-2" />
                                                        <span className="font-medium text-blue-800 dark:text-blue-100">Practice = Reduced Time</span>
                                                    </div>
                                                    <p className="text-sm text-blue-700 dark:text-blue-200">
                                                        Each minute of practice slightly reduces the cooldown!
                                                    </p>
                                                </div>
                                            )}

                                            {remainingTime > 0 && (
                                                <div className="mb-6">
                                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                        <span>Recovery progress</span>
                                                        <span>{Math.round(progressPercentage)}%</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                                                            initial={{ width: "0%" }}
                                                            animate={{ width: `${progressPercentage}%` }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-3">
                                            {timeLeft > 0 ? (
                                                <>
                                                    {canPractice ? (
                                                        <Button
                                                            onClick={() => { }}
                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                            size="lg"
                                                        >
                                                            <BookOpen className="h-5 w-5 mr-2" />
                                                            Start Practice
                                                        </Button>
                                                    ) : (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                                                            Practice mode is not available for this lesson. You must wait for the full cooldown.
                                                        </div>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        onClick={handleClose}
                                                        className="w-full dark:border-gray-700 dark:text-white"
                                                    >
                                                        Back to lesson
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    onClick={handleClose}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                    size="lg"
                                                >
                                                    <Heart className="h-5 w-5 mr-2" />
                                                    Retry the quiz
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

}

function HeartsAnimation({ theme }: { theme: string }) {
    return (
        <div className="relative w-64 h-32 flex items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-primary-foreground/100 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            <div className="flex space-x-4 items-center">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 0.9, 0] }}
                        transition={{
                            duration: 0.8,
                            delay: i * 0.5,
                            times: [0, 0.2, 0.4, 1],
                        }}
                    >
                        <div className="relative">
                            <Heart className="h-10 w-10 text-red-500 fill-red-500" />

                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 1.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.5 + 0.2 }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="absolute bottom-2 left-0 w-full text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8, duration: 0.5 }}
            >
                <span className="text-lg font-medium text-red-500">0 lives left</span>
            </motion.div>

            <motion.div
                className="absolute bottom-12 left-[42%] transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.5 }}
            >
                <BrokenHeartAnimation theme={theme} />
            </motion.div>
        </div>
    )
}

function LifeRegenAnimation() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 1.5, times: [0, 0.6, 1] }}
            />

            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2
                const radius = 60
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400 rounded-full"
                        style={{ left: "50%", top: "50%" }}
                        initial={{ x: x, y: y, opacity: 0, scale: 0 }}
                        animate={{
                            x: [x, 0],
                            y: [y, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 1.2,
                            delay: i * 0.1,
                            times: [0, 0.5, 1],
                        }}
                    />
                )
            })}

            <motion.div
                className="relative z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 200 }}
            >
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    <motion.div
                        className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
                        initial={{ x: -20, rotate: -15 }}
                        animate={{ x: 0, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    >
                        <Heart className="h-16 w-16 text-red-300 fill-red-300" />
                    </motion.div>

                    <motion.div
                        className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
                        initial={{ x: 20, rotate: 15 }}
                        animate={{ x: 0, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    >
                        <Heart className="h-16 w-16 text-red-300 fill-red-300" style={{ marginLeft: "-2rem" }} />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8, times: [0, 0.6, 1] }}
                >
                    <Heart className="h-16 w-16 text-red-500 fill-red-500" />

                    {Array.from({ length: 8 }).map((_, i) => {
                        const sparkleAngle = (i / 8) * Math.PI * 2
                        const sparkleRadius = 35
                        const sparkleX = Math.cos(sparkleAngle) * sparkleRadius
                        const sparkleY = Math.sin(sparkleAngle) * sparkleRadius

                        return (
                            <motion.div
                                key={`sparkle-${i}`}
                                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                                style={{ left: "50%", top: "50%" }}
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                animate={{
                                    x: [0, sparkleX, sparkleX * 1.5],
                                    y: [0, sparkleY, sparkleY * 1.5],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 1,
                                    delay: 1.8 + i * 0.1,
                                    times: [0, 0.5, 1],
                                }}
                            />
                        )
                    })}
                </motion.div>

                <motion.div
                    className="absolute inset-0 border-2 border-green-400 rounded-full"
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: [1, 2, 3], opacity: [0, 0.6, 0] }}
                    transition={{ delay: 2, duration: 1.5, repeat: 2 }}
                />
            </motion.div>

            <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.5 }}
            >
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">+1 Viață</div>
            </motion.div>
        </div>
    )
}

function TimerDisplay({ timeLeft, totalTime }: { timeLeft: number, totalTime: number }) {
    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 100

    return (
        <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F97316"
                    strokeWidth="8"
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
                    className="text-xl font-bold text-orange-600"
                    animate={{ scale: timeLeft % 60 === 0 && timeLeft > 0 ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {Math.floor(timeLeft / 60)}
                </motion.div>
                <div className="text-xs text-gray-500">{Math.floor(timeLeft / 60) === 1 ? "min" : "min"}</div>
            </div>

            <motion.div
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            >
                <Heart className="h-3 w-3 text-white fill-white" />
            </motion.div>
        </div>
    )
}

function BrokenHeartAnimation({ theme }: { theme: string }) {
    return (
        <div className="relative w-20 h-20">
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                <Heart className="w-full h-full text-red-500 fill-red-500" />
            </motion.div>

            <motion.svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 24 24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.2 }}
            >
                <path
                    d="M12 4 L10 8 L14 12 L10 16 L12 20"
                    stroke={theme === "dark" ? "white" : "black"}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </motion.svg>

            <motion.div
                className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
                initial={{ x: 0, rotate: 0, opacity: 0 }}
                animate={{
                    x: -12,
                    y: [0, -4, 6],
                    rotate: -15,
                    opacity: 1,
                }}
                transition={{
                    delay: 0.7,
                    duration: 1,
                    y: { duration: 1, times: [0, 0.4, 1] },
                }}
            >
                <Heart className="w-full h-full text-red-500 fill-red-500" />
            </motion.div>

            <motion.div
                className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
                initial={{ x: 0, rotate: 0, opacity: 0 }}
                animate={{
                    x: 12,
                    y: [0, -4, 6],
                    rotate: 15,
                    opacity: 1,
                }}
                transition={{
                    delay: 0.7,
                    duration: 1,
                    y: { duration: 1, times: [0, 0.4, 1] },
                }}
            >
                <Heart className="w-full h-full text-red-500 fill-red-500" style={{ marginLeft: "-50%" }} />
            </motion.div>
        </div>
    );
}
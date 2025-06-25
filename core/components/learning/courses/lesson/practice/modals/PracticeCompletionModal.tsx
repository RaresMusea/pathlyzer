"use client";

import { Button } from "@/components/ui/button";
import { useGamification } from "@/context/GamificationContext";
import { formatTime } from "@/lib/TimeUtils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle, Heart, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const PracticeCompletionModal = ({ onClose, practiceTime }: { onClose: () => void; practiceTime: number; }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [showHeartAnimation, setShowHeartAnimation] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { setLives } = useGamification();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHeartAnimation(false);
        }, 4000);

        const finishPractice = async () => {
            const { courseId, lessonId } = getParams();

            if (!courseId || !lessonId) {
                return;
            }

            const response = await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}/grant-life`);

            if (response.status === 200) {
                setLives(response.data.lives);
            } else {
                toast.error("Failed to grant life. Please try again later.");
                console.error("Failed to grant life:", response.data);
            }
        }

        finishPractice();

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const getParams = () => {
        const sections = pathname.split("/");
        const lessonId = sections[sections.length - 2];
        const courseIndex = sections.indexOf("learn");
        const courseId = courseIndex !== -1 ? sections[courseIndex + 1] : null;

        return { courseId, lessonId };
    }

    const navigateBackToLesson = () => {
        const { courseId, lessonId } = getParams();

        router.push(`/courses/learn/${courseId}/lesson/${lessonId}`);
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 font-nunito flex items-center justify-center p-4 bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-w-md w-full relative"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 py-6 px-8 text-center">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <CheckCircle className="h-10 w-10 text-white mx-auto" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mt-2">Practice Completed!</h2>
                            <p className="text-green-100 dark:text-green-200 mt-1">
                                Congratulations! You&apos;ve recovered a life.
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
                                        <HeartRegenerationAnimation />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="completion-content"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
                                                Great progress!
                                            </h3>

                                            <div className="bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                                                <div className="grid grid-cols-2 gap-4 text-center">
                                                    <div>
                                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            {formatTime(practiceTime)}
                                                        </div>
                                                        <div className="text-sm text-green-700 dark:text-green-300">
                                                            Time spent
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-2xl font-bold text-red-500 dark:text-red-400">+1</div>
                                                        <div className="text-sm text-red-700 dark:text-red-300">
                                                            Life recovered
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                You&apos;ve successfully completed the practice session! Your
                                                knowledge has been reinforced and you&apos;ve recovered a life
                                                to continue the quiz.
                                            </p>

                                            <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                                <div className="flex items-center justify-center mb-2">
                                                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                                    <span className="font-medium text-blue-800 dark:text-blue-300">
                                                        Next step
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    You can now retake the quiz with boosted confidence!
                                                </p>
                                            </div>
                                        </div>

                                        <motion.div
                                            className="flex flex-col gap-4 justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Button
                                                onClick={handleClose}
                                                size="lg"
                                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-8 py-6 text-md rounded-lg shadow-md transition-all duration-300 hover:shadow-lg w-full"
                                            >
                                                <Heart className="h-5 w-5 mr-2" fill="currentColor" />
                                                Continue with Quiz
                                            </Button>
                                            <Button
                                                onClick={navigateBackToLesson}
                                                size="lg"
                                                className="bg-[var(--pathlyzer)] hover:bg-[var(--pathlyzer-table-border)] text-white px-8 py-6 text-md rounded-lg shadow-md transition-all duration-300 hover:shadow-lg w-full"
                                            >
                                                <BookOpen className="h-5 w-5 mr-2" />
                                                Back to lesson
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <FloatingSparkles />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function HeartRegenerationAnimation() {
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full opacity-20"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 1.5, times: [0, 0.6, 1] }}
            />

            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const radius = 60;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400 rounded-full"
                        style={{ left: "50%", top: "50%" }}
                        initial={{ x, y, opacity: 0, scale: 0 }}
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
                );
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
                        const sparkleAngle = (i / 8) * Math.PI * 2;
                        const sparkleRadius = 35;
                        const sparkleX = Math.cos(sparkleAngle) * sparkleRadius;
                        const sparkleY = Math.sin(sparkleAngle) * sparkleRadius;

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
                        );
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
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    +1 life
                </div>
            </motion.div>
        </div>
    );
}

function FloatingSparkles() {
    const sparkles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 2,
        size: Math.random() * 4 + 2,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {sparkles.map((sparkle) => (
                <motion.div
                    key={sparkle.id}
                    className="absolute"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: sparkle.duration,
                        delay: sparkle.delay,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        times: [0, 0.5, 1],
                    }}
                >
                    <Sparkles className="w-full h-full text-yellow-400" />
                </motion.div>
            ))}
        </div>
    );
}
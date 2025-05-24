"use client";

import { Button } from "@/components/ui/button";
import { useExamination } from "@/context/ExaminationContext";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export const OutOfLivesModal = () => {
    const [isVisible, setIsVisible] = useState(true);
    const { closeOutOfLivesModal } = useExamination();
    const theme = useTheme().theme;

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            closeOutOfLivesModal();
        }, 500);
    };

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
                            <p className="text-red-100 mt-1">You need to retake the course to continue.</p>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-center mb-8">
                                <HeartsAnimation theme={theme as string} />
                            </div>

                            <motion.div
                                className="text-center mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-xl font-semibold mb-2 text-foreground">
                                    All lives lost
                                </h3>
                                <p className="text-muted-foreground">
                                    To gain another life and resume the quiz, you&apos;ll need to complete the course again.
                                </p>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
                                <Button
                                    onClick={handleClose}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                                    size="lg"
                                >
                                    Return to lesson
                                </Button>
                            </motion.div>
                        </div>

                        <FloatingHeartPieces />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

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

function FloatingHeartPieces() {
    const pieces = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        endX: Math.random() * 100,
        endY: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 2 + 3,
        duration: Math.random() * 3 + 4,
        rotationSpeed: Math.random() * 720 + 360
    }))

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {pieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute"
                    style={{
                        left: `${piece.startX}%`,
                        top: `${piece.startY}%`,
                        width: `${piece.size}px`,
                        height: `${piece.size}px`,
                    }}
                    initial={{
                        opacity: 0,
                        scale: 0,
                        rotate: 0,
                    }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1, 1, 0],
                        rotate: piece.rotationSpeed,
                        x: [0, (piece.endX - piece.startX) * 4],
                        y: [0, (piece.endY - piece.startY) * 4],
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        times: [0, 0.1, 0.8, 1],
                        ease: "easeOut",
                    }}
                >
                    <div
                        className="w-full h-full bg-red-500 rounded-sm"
                        style={{
                            clipPath:
                                piece.id % 3 === 0
                                    ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                                    : piece.id % 3 === 1
                                        ? "polygon(0% 0%, 100% 0%, 50% 100%)"
                                        : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                        }}
                    />
                </motion.div>
            ))}

            {Array.from({ length: 6 }, (_, i) => {
                const heartPiece = {
                    id: i + 20,
                    startX: Math.random() * 100,
                    startY: Math.random() * 100,
                    endX: Math.random() * 100,
                    endY: Math.random() * 100,
                    size: Math.random() * 6 + 8,
                    delay: Math.random() * 2 + 3.5,
                    duration: Math.random() * 4 + 5,
                    rotationSpeed: Math.random() * 540 + 180,
                }

                return (
                    <motion.div
                        key={`heart-${heartPiece.id}`}
                        className="absolute"
                        style={{
                            left: `${heartPiece.startX}%`,
                            top: `${heartPiece.startY}%`,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0,
                            rotate: 0,
                        }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1, 0],
                            rotate: heartPiece.rotationSpeed,
                            x: [0, (heartPiece.endX - heartPiece.startX) * 3],
                            y: [0, (heartPiece.endY - heartPiece.startY) * 3],
                        }}
                        transition={{
                            duration: heartPiece.duration,
                            delay: heartPiece.delay,
                            times: [0, 0.1, 0.8, 1],
                            ease: "easeOut",
                        }}
                    >
                        <Heart
                            className={`text-red-500 fill-red-500`}
                            style={{
                                width: `${heartPiece.size}px`,
                                height: `${heartPiece.size}px`,
                                filter: "brightness(0.8)",
                            }}
                        />
                    </motion.div>
                )
            })}

            {Array.from({ length: 8 }, (_, i) => {
                const sparkle = {
                    id: i + 30,
                    startX: Math.random() * 100,
                    startY: Math.random() * 100,
                    delay: Math.random() * 3 + 3,
                    duration: Math.random() * 2 + 2,
                }

                return (
                    <motion.div
                        key={`sparkle-${sparkle.id}`}
                        className="absolute w-2 h-2"
                        style={{
                            left: `${sparkle.startX}%`,
                            top: `${sparkle.startY}%`,
                        }}
                        initial={{
                            opacity: 0,
                            scale: 0,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: sparkle.duration,
                            delay: sparkle.delay,
                            times: [0, 0.5, 1],
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-full h-full bg-red-400 transform rotate-45" />
                    </motion.div>
                )
            })}
        </div>
    )
}
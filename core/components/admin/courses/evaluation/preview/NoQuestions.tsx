"use client";

import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export const NoQuestions = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative mb-6"
            >
                <motion.div
                    animate={{
                        rotate: [0, -5, 5, -5, 0],
                    }}
                    transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                        duration: 4,
                        ease: "easeInOut",
                    }}
                    className="text-muted-foreground"
                >
                    <QuestionMarkIcon className="w-16 h-16 mx-auto mb-2" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                    className="absolute -bottom-2 -right-2"
                >
                    <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </motion.div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-2xl font-bold tracking-tight mb-2"
            >
                No questions found.
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-muted-foreground mb-6 max-w-md"
            >
                You can use the Editor tab for adding new questions.
            </motion.p>
        </motion.div>
    );
}
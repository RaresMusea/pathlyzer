"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
    const sizeClass = {
        small: "h-4 w-4",
        default: "h-8 w-8",
        large: "h-12 w-12",
    };

    return (
        <div className="flex justify-center items-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
                <Loader2 className={sizeClass[size]} />
            </motion.div>
        </div>
    )
}

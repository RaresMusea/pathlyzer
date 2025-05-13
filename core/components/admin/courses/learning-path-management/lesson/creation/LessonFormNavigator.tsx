"use client";

import { Button } from "@/components/ui/button";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const TOTAL_STEPS: number = 3;

export const LessonFormNavigator = () => {
    const { currentStep, buttonOptions, onPrevStep, onNextStep } = useLessonBuilder();

    return (
        <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2">
                <motion.span
                    className="text-sm font-medium"
                    key={currentStep}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                >
                    Step {currentStep} of {TOTAL_STEPS}
                </motion.span>
                <div className="flex gap-1">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`h-2 rounded-full ${i === (currentStep - 1) ? "bg-[var(--pathlyzer-table-border)]" : "bg-gray-200"}`}
                            initial={{ width: i === (currentStep - 1) ? 32 : 16 }}
                            animate={{
                                width: i === (currentStep - 1) ? 32 : 16,
                                backgroundColor: i === (currentStep - 1) ? "#3b82f6" : "#e5e7eb",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                {currentStep > 1 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" onClick={onPrevStep} className="flex items-center gap-1 px-4 py-2 border rounded-md">
                            <ChevronLeft size={16} />
                            Back to {buttonOptions[currentStep - 1]}
                        </Button>
                    </motion.div>
                )}

                {currentStep < TOTAL_STEPS ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="outline"
                            onClick={onNextStep}
                            className="flex items-center gap-1 px-4 py-2 bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white dark:text-white rounded-md"
                        >
                            Next: {buttonOptions[currentStep]}
                            <ChevronRight size={16} />
                        </Button>
                    </motion.div>
                ) : (
                    <Button type="submit" className="px-4 py-2 bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white rounded-md">
                        <Save className="h-4 w-4 mr-2" />
                        Save lesson
                    </Button>
                )}
            </div>
        </div>
    )
}
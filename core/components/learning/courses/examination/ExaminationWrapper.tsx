"use client";

import { QuizType } from "@prisma/client";
import { ExaminationLandingModal } from "./ExaminationLandingModal";
import { useState } from "react";
import { ExaminationExitConfirmationDialog } from "./ExaminationExitConfirmationDialog";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAppNavLogo } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";

export const ExaminationWrapper = ({ type }: { type: QuizType }) => {
    const [isOnLanding, setIsOnLanding] = useState(true);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const router = useRouter();
    const theme = useTheme().theme;

    const onExit = () => {
        if (type === QuizType.LESSON_QUIZ) {
            router.push('../..');
        }
    }

    return (
        <>
            <AnimatePresence>
                {showExitDialog && (
                    <ExaminationExitConfirmationDialog
                        onConfirm={() => { setShowExitDialog(false); onExit(); }}
                        onCancel={() => { setShowExitDialog(false); }}
                    />
                )}
            </AnimatePresence>
            <header className="border-b font-nunito shadow-md border-[hsl(var(--border))] py-2 px-4 sm:px-6">
                <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center justify-between">
                        <Image src={getAppNavLogo(theme || 'dark')} width={80} height={96} alt="Logo" />
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                            <ThemeToggle />
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-center w-full sm:w-auto">
                        {getFormattedType(type)} preparation
                    </h1>

                    <div className="hidden sm:flex items-center gap-2 min-w-[120px] justify-end">
                        <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)} className="rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                        <ThemeToggle />
                    </div>

                </div>
            </header>
            {
                isOnLanding &&
                <ExaminationLandingModal type={type} onStart={() => setIsOnLanding(false)} />
            }
        </>
    )

}
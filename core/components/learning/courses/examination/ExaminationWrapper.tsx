"use client";

import { QuizType } from "@prisma/client";
import { ExaminationLandingModal } from "./ExaminationLandingModal";
import { ExaminationExitConfirmationDialog } from "./ExaminationExitConfirmationDialog";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getAppNavLogo } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getFormattedType } from "@/lib/LearningPathManagementUtils";
import { ExaminationComponent } from "./ExaminationComponent";
import { ExaminationState, useExamination } from "@/context/ExaminationContext";

export const ExaminationWrapper = () => {
    const {examinationState, examinationType, abortDialogVisible, inferExaminationTitle, openAbortModal} = useExamination();
    const theme = useTheme().theme;

    return (
        <>
            <AnimatePresence>
                {abortDialogVisible && (
                    <ExaminationExitConfirmationDialog />
                )}

            </AnimatePresence>
            <header className="border-b font-nunito shadow-md border-[hsl(var(--border))] py-2 px-4 sm:px-6">
                <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center justify-between">
                        <Image src={getAppNavLogo(theme || 'dark')} width={80} height={96} alt="Logo" />
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button variant="ghost" size="icon" onClick={openAbortModal} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                            <ThemeToggle />
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-center w-full sm:w-auto">
                        {inferExaminationTitle()}
                    </h1>

                    <div className="hidden sm:flex items-center gap-2 min-w-[120px] justify-end">
                        <Button variant="ghost" size="icon" onClick={openAbortModal} className="rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                        <ThemeToggle />
                    </div>

                </div>
            </header>
            {
                examinationState === ExaminationState.LANDING ?
                <ExaminationLandingModal />
                :
                <ExaminationComponent />
            }
        </>
    )

}
"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { OutOfFocusWarningModal } from "./OutOfFocusWarningModal";
import { useExamination } from "@/context/ExaminationContext";

const MAX_FOCUS_LOSSES: number = 3;

export const ExaminationComponent = () => {
    const { outOfFocusVisible, openOutOfFocusModal } = useExamination();
    const [focusLossCount, setFocusLossCount] = useState(0);

    const handleFocusLoss = () => {
        const newCount: number = focusLossCount + 1;
        setFocusLossCount(focusLossCount + 1);

        if (newCount >= MAX_FOCUS_LOSSES) {
            //@TODO: Set a penalty modal to visible
            //@TODO Lose all lives
        }
        else {
            openOutOfFocusModal();
        }
    }

    useEffect(() => {
        const handleViewSwitch = () => {
            if (document.visibilityState === 'hidden') {
                handleFocusLoss();
            }
        }

        const handleBlur = () => {
            handleFocusLoss()
        }

        document.addEventListener('visibilitychange', handleViewSwitch);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleViewSwitch);
            document.removeEventListener('blur', handleBlur);
        }
    }, [focusLossCount]);

    return (
        <div>
            <AnimatePresence>
                {
                    outOfFocusVisible &&
                    <OutOfFocusWarningModal />
                }
            </AnimatePresence>
        </div>
    )
}
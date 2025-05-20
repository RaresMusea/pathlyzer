"use client";

import { QuizType } from "@prisma/client";
import { ExaminationLandingModal } from "./ExaminationLandingModal";
import { useState } from "react";

export const ExaminationWrapper = ({type}: {type: QuizType}) => {
    const [isOnLanding, setIsOnLanding] = useState(true);
    
    const onExit = () => {
        
    }

    return (
        <ExaminationLandingModal type={type} onExit={onExit} onStart={() => setIsOnLanding(false)} />
    )
}
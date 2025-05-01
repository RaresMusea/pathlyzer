"use client";

import { UserStatsDto } from "@/types/types";
import { createContext, useContext, useState } from "react";

interface GamificationContextProps {
    lives: number;
    level: number;
    xp: number;
}

const GamificationContext = createContext<GamificationContextProps | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode, initialUserStats: UserStatsDto }> = ({ children, initialUserStats }) => {

    const [lives, setLives] = useState<number>(initialUserStats.lives);
    const [level, setLevel] = useState<number>(initialUserStats.level);
    const [xp, setXp] = useState<number>(initialUserStats.xp);


    return (
        <GamificationContext.Provider value={{lives, level, xp}}>
            {children}
        </GamificationContext.Provider>
    );
}

export const useGamification = () => {
    const context = useContext(GamificationContext);

    if (!context) {
        throw new Error("useGamification() must be used within a GamificationProvider component!");
    }

    return context;
};
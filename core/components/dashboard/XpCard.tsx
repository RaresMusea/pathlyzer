"use client";

import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getXpThreshold } from "@/lib/UserUtils";

export const XpCard = ({ xp, level }: { xp: number, level: number }) => {

    const currentLevelXp = getXpThreshold(level);
    const nextLevelXp = getXpThreshold(level + 1);

    const xpSinceLevelStart = xp - currentLevelXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
    const progressPercentage = xpNeededForNextLevel > 0
  ? Math.min(Math.max((xpSinceLevelStart / xpNeededForNextLevel) * 100, 0), 100)
  : 0;

    return (
        <Card className="group hover:shadow-lg h-auto min-h-fit dark:bg-muted/50 font-nunito transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Experience & Level</CardTitle>
                <div className="p-2 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors">
                    <Zap className="h-4 w-4 text-yellow-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{xp.toLocaleString()} XP</div>
                    <div className="text-2xl font-bold">Level {level.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div className="h-2 bg-muted rounded-full flex-1">
                        <div className="h-2 bg-yellow-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{100 - Math.floor(progressPercentage)}% until reaching level {level + 1}</span>
                </div>
            </CardContent>
        </Card>
    );
}
"use client";

import { useGamification } from "@/context/GamificationContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Heart, HeartCrack } from "lucide-react";
import { useCooldown } from "@/hooks/useCooldown";
import { formatTime } from "@/lib/TimeUtils";
import { CooldownReason } from "@prisma/client";

const formatCooldownReason = (reason?: CooldownReason): string => {

    if (reason === CooldownReason.NORMAL) {
        return 'All lives were lost during evaluation.'
    }

    if (reason === CooldownReason.FRAUD) {
        return 'Evaluation fraud';
    }

    return 'Unknown';
}

export const LivesCard = ({ cooldownReason, cooldownDuration }: { lives: number, cooldownReason?: CooldownReason, cooldownDuration?: number }) => {
    const { lives, setLives } = useGamification();
    const { remainingCooldown } = useCooldown(lives, setLives);

    const maxCooldownSeconds = (cooldownDuration ?? 0) * 60;
    const clampedCooldown = Math.max(0, Math.min(remainingCooldown, maxCooldownSeconds));
    const progressPercentage = maxCooldownSeconds > 0 ? Math.min(((1 - clampedCooldown / maxCooldownSeconds) * 100), 100) : 0;

    return (
        <Card className="group hover:shadow-lg h-auto min-h-fit dark:bg-muted/50 font-nunito transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Lives</CardTitle>
                <div className="p-2 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                    {lives !== 0 ? <Heart className="h-4 w-4 text-red-500" /> : <HeartCrack className="h-4 w-4 text-red-500" />}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    {lives > 0 ? <div className="text-2xl font-bold">{lives} / 5 lives</div> : <span className="text-red-600 text-2xl font-bold">Out of lives</span>}

                </div>
                <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Heart
                            key={i}
                            className={`h-6 w-6 ${i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground"}`}
                        />
                    ))}
                </div>
                <div>
                    {
                        lives === 0 &&
                        <div className="flex flex-col">
                            <span className="text-orange-500">Cooldown reason: {formatCooldownReason(cooldownReason)}</span>
                            Next life in {formatTime(remainingCooldown)}
                        </div>
                    }
                </div>
                {lives === 0 &&
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-2 bg-muted rounded-full flex-1">
                            <div className="h-2 bg-red-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground w-10 text-right">
                            {Math.floor(progressPercentage)}%
                        </div>
                    </div>
                }
            </CardContent>
        </Card>
    )
}
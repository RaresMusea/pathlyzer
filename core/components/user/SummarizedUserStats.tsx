"use client";

import { SummarizedUserStats } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { PopoverArrow } from "@radix-ui/react-popover";
import { getXpThreshold } from "@/lib/UserUtils";
import { Progress } from "../ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { useCooldown } from "@/hooks/useCooldown";
import { formatTime } from "@/lib/TimeUtils";

export const SummarizedUserStatsWrapper = ({ userStats }: { userStats: SummarizedUserStats }) => {
    const [livesPopoverOpen, setLivesPopoverOpen] = useState(false);
    const [xpPopoverOpen, setXpPopoverOpen] = useState(false);
    const { lives, setLives } = useGamification();
    const { remainingCooldown } = useCooldown(lives, setLives);

    return (
        <div className="flex items-center gap-4 text-sm font-medium cursor-pointer">
            <Popover open={livesPopoverOpen} onOpenChange={setLivesPopoverOpen}>
                <PopoverTrigger onMouseEnter={() => { if (livesPopoverOpen) { setLivesPopoverOpen(false); } setLivesPopoverOpen(true) }} onMouseLeave={() => setLivesPopoverOpen(false)} asChild>
                    <div className="flex items-center">
                        <Heart className={`h-5 w-5 mr-2 ${userStats?.lives ? "text-red-500 fill-red-500" : "text-muted-foreground"}`} />
                        {userStats?.lives}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="font-nunito space-y-2">
                    <div>
                        The number of lives you have left. Each wrong answer will cost you a life.
                        You can regain lives by practicing previous lessons or by passing unit exams.
                    </div>
                    {remainingCooldown > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                            Next life in: {formatTime(remainingCooldown)}
                        </div>
                    )}
                    <PopoverArrow className="fill-gray-300 dark:fill-gray-900" />
                </PopoverContent>

            </Popover>
            <Popover open={xpPopoverOpen} onOpenChange={setXpPopoverOpen}>
                <PopoverTrigger
                    onMouseEnter={() => setXpPopoverOpen(true)}
                    onMouseLeave={() => setXpPopoverOpen(false)}
                    asChild
                >
                    <div className="flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                        {userStats?.xp} XP
                    </div>
                </PopoverTrigger>
                <PopoverContent className="font-nunito">
                    The amount of experience points you have earned. You can earn XP by completing lessons, quizzes, and unit exams.
                    <div className="space-y-2 mt-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium flex items-center">
                                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                                Experience (XP)
                            </h3>
                            <span className="font-bold">
                                {userStats?.xp}/{getXpThreshold(userStats?.level + 1)}
                            </span>
                        </div>
                        <Progress value={(userStats?.xp / getXpThreshold(userStats?.level + 1)) * 100} className="h-2" />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center">
                                <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                                Level {userStats?.level}
                            </div>
                            <div className="flex items-center">
                                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                Level {userStats?.level + 1}
                            </div>
                        </div>
                    </div>
                    <PopoverArrow className="fill-gray-300 dark:fill-gray-900" />
                </PopoverContent>
            </Popover>
        </div >
    )
}
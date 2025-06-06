"use client";

import { Heart, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { getXpThreshold } from "@/lib/UserUtils";


export const UserProgress = () => {
    const { lives, xp, level } = useGamification();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Your progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Lives */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <Heart className="mr-2 h-5 w-5 text-red-500" />
                            Lifes
                        </h3>
                        <span className="font-bold">
                            {lives}/{5}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Heart
                                key={i}
                                className={`h-6 w-6 ${i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground"}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Regain life points by completing previous sections of a course</p>
                </div>

                {/* XP */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                            Experience (XP)
                        </h3>
                        <span className="font-bold">
                            {xp}/{getXpThreshold(level + 1)}
                        </span>
                    </div>
                    <Progress value={(xp / getXpThreshold(level + 1)) * 100} className="h-2" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                            Level {level}
                        </div>
                        <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                            Level {level + 1}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
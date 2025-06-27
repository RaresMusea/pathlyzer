"use client";

import { Clock, Clock1, Flame, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatSecondsToTimeReadable } from "@/lib/TimeUtils";

export const LearningTimeCard = ({ learningTime, longestStreak }: { learningTime: number, longestStreak: number }) => {
    return (
        <Card className="group hover:shadow-lg h-auto min-h-fit dark:bg-muted/50 font-nunito transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Learning time</CardTitle>
                <div className="p-2 bg-white rounded-full group-hover:bg-[var(--pathlyzer)] hover:bg-white transition-colors">
                    <Target className="h-4 w-4 text-[var(--pathlyzer-table-border)]" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm text-muted-foreground mb-1">Total learning time</div>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <Clock1 className="w-5 h-5 text-muted-foreground" />
                        <span>{formatSecondsToTimeReadable(learningTime)}</span>
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground mb-1">Longest learning streak</div>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <Flame className="w-5 h-5 text-muted-foreground" />
                        <span>{longestStreak === 1 ? `${longestStreak} day` : `${longestStreak} days`}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
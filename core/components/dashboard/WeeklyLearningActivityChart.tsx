"use client";

import { WeeklyActivityEntry } from "@/types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { formatSecondsToTimeReadable, getCurrentWeekRange } from "@/lib/TimeUtils";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
                <p className="font-medium text-foreground">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}:
                        {entry.dataKey === "duration"
                            ? ` ${formatSecondsToTimeReadable(entry.value)}`
                            : ` ${entry.value}${entry.dataKey === "xpGained" ? " XP" : ""}`}
                    </p>
                ))}
            </div>
        )
    }
    return null
}


export const WeeklyLearningActivityChart = ({ weeklyActivity }: { weeklyActivity: WeeklyActivityEntry[] }) => {
    return (
        <Card className="w-full max-w-4xl sm:w-full mx-auto hover:shadow-lg transition-all animate-in fade-in-0 slide-in-from-left-4 duration-1000">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly activity
                </CardTitle>
                <CardDescription>Learning sessions, time spent, along with the acquired XP<br />
                    <span className="text-muted-foreground text-xs">
                        Week: {getCurrentWeekRange()}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto w-full">
                <div className="min-w-[480px] sm:min-w-full">
                    <ChartContainer
                        config={{
                            sessions: {
                                label: "Sessions",
                                color: "hsl(var(--chart-1))",
                            },
                            duration: {
                                label: "Minutes",
                                color: "hsl(var(--chart-2))",
                            },
                            xpGained: {
                                label: "Acquired XP",
                                color: "hsl(var(--chart-3))",
                            },
                        }}
                        className="h-[250px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <ChartTooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="sessions"
                                    fill="var(--color-sessions)"
                                    radius={[4, 4, 0, 0]}
                                    className="hover:opacity-80 transition-opacity"
                                />
                                <Bar
                                    dataKey="duration"
                                    fill="var(--color-duration)"
                                    radius={[4, 4, 0, 0]}
                                    className="hover:opacity-80 transition-opacity"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
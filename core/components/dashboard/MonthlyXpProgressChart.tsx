"use client";

import { Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { MonthlyXpProgressDto } from "@/types/types";
import { useState, useEffect } from "react";

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        name: string;
        payload: MonthlyXpProgressDto;
        color: string;
        dataKey: string;
    }[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">
                    XP: {data.xp}
                </p>
                <p className="text-sm text-muted-foreground">
                    Level this year: {data.level}
                </p>
                <p className="text-sm text-muted-foreground">
                    Actual Level: {data.globalLevel}
                </p>
            </div>
        );
    }
    return null;
};

export const MonthlyXpProgressChart = ({
    monthlyXpProgress
}: {
    monthlyXpProgress: MonthlyXpProgressDto[]
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Card className="lg:col-span-2 h-[462px]">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Loading Chart...
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="lg:col-span-2 hover:shadow-lg transition-all">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    XP & Level Progress {(new Date()).getFullYear()}
                </CardTitle>
                <CardDescription>Experience points and level evolution throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyXpProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="xp"
                                stroke="var(--pathlyzer-table-border)"
                                strokeWidth={3}
                                dot={{ fill: "var(--pathlyzer-table-border)", strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, className: "animate-pulse" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

"use client";

import { Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SkilsDistributionDto } from "@/types/types";

export const SkillsDistributionPieChart = ({ skillsDistribution }: { skillsDistribution: SkilsDistributionDto[] }) => {
    if (!skillsDistribution || skillsDistribution.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Skills Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[280px] flex items-center justify-center">
                        <p>No skills distribution data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-lg transition-all animate-in fade-in-0 slide-in-from-right-4 duration-1000">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills Distribution
                </CardTitle>
                <CardDescription>The amount of projects built using each technology</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={skillsDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={2}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, payload }) => `${name}: ${payload.percent.toFixed(0)}%`}
                            >
                                {skillsDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="var(--border)"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length && payload[0]?.payload) {
                                        const data = payload[0].payload as SkilsDistributionDto;
                                        return (
                                            <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                                                <p className="font-medium">{data.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {data.value} {data.value === 1 ? "project" : "projects"} ({data.percent.toFixed(0)}%)
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
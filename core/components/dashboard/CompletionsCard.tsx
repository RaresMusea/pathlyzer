"use client";

import { UserLearningCompletionDto } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookOpen } from "lucide-react";

export const CompletionsCard = ({ userCompletions }: { userCompletions: UserLearningCompletionDto }) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4 delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Completions</CardTitle>
                <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Courses</span>
                        <span className="text-2xl font-bold">{userCompletions.completedCourses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lessons</span>
                        <span className="text-2xl font-bold">{userCompletions.completedLessons}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Units</span>
                        <span className="text-2xl font-bold">{userCompletions.completedUnits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Evaluations</span>
                        <span className="text-2xl font-bold">{userCompletions.completedEvaluations}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
"use client";

import { LearningLessonItem } from "@/types/types";
import { Check, CircleCheckBig, CircleDotDashed, Crown, LayoutList, LockKeyholeOpen, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import 'react-circular-progressbar/dist/styles.css';
import { Popover, PopoverArrow, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";


type LessonProps = LearningLessonItem & { index: number, totalAmount: number };

const getLessonStates = (lesson: LessonProps) => {
    if (lesson.isCompleted) {
        return (
            <div className="mt-5 text-center">
                <Badge className="bg-green-400 dark:bg-green-700 text-white font-bold"><CircleCheckBig className="mr-2 h-3 w-3" /> LESSON COMPLETED</Badge>
            </div>
        );
    }

    if (lesson.learningProgress === 0 || !lesson.learningProgress) {
        return (
            <div className="mt-5 text-center">
                <Badge className="bg-gray-500 dark:bg-gray-700 text-white font-bold"><LockKeyholeOpen className="mr-2 h-3 w-3" /> LESSON UNLOCKED, NOT STARTED YET</Badge>
            </div>
        );
    }

    if (lesson.learningProgress > 0 && lesson.learningProgress < 100) {
        console.warn("Currently learning, ", lesson.learningProgress);
        return (
            <div className="mt-5 text-center">
                <Badge className="bg-orange-400 dark:bg-orange-700 text-white font-bold"><CircleDotDashed className="mr-2 h-3 w-3" /> LEARNING IN PROGRESS ({lesson.learningProgress}%)</Badge>
            </div>
        );
    }

    if (lesson.learningProgress === 100 && !lesson.isCompleted) {
        console.log("Lesson learned, but no quiz taken");
        return (
            <div className="mt-5 text-center">
                <Badge className="bg-orange-400 dark:bg-orange-700 text-white font-bold"><LayoutList className="mr-2 h-3 w-3" /> LESSON COMPLETE, QUIZ REMAINING</Badge>
            </div>
        );
    }
}

export const Lesson = ({ lessonInfo, isCurrent, learningProgress, isAccessible, isCompleted, index, totalAmount }: LessonProps) => {
    const pathname = usePathname();
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;
    let indentationLevel;

    if (cycleIndex <= 2) {
        indentationLevel = cycleIndex;
    }
    else if (cycleIndex <= 4) {
        indentationLevel = 4 - cycleIndex;
    } else if (cycleIndex <= 6) {
        indentationLevel = 4 - cycleIndex;
    }
    else {
        indentationLevel = cycleIndex - 8;
    }

    const rightPosition = indentationLevel * 40;
    const isFirst = index === 0;
    const isLast = index === totalAmount;

    const Icon = isCompleted ? Check : isLast ? Crown : Star;

    //To be defined more precisely later on
    const href = isCompleted ? `/lesson/${lessonInfo.id}` : `${pathname}/lesson/${lessonInfo.id}`;

    const [popoverOpen, setPopoverOpen] = useState(false);


    return (
        <Link href={href} aria-disabled={!isAccessible} style={{ pointerEvents: !isAccessible ? "none" : "auto" }}>
            <div className="relative"
                style={{
                    right: `${rightPosition}px`,
                    marginTop: `${isFirst && !isCompleted ? 60 : 24}px`,
                }}>
                {
                    isCurrent ? (
                        <div className="h-[102px] w-[102px] relative">
                            <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-[var(--pathlyzer-table-border)] bg-muted/50 rounded-xl animate-bounce tracking-wide z-10">
                                Start
                                <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2"></div>
                            </div>
                            <CircularProgressbarWithChildren value={learningProgress}
                                styles={{
                                    path: {
                                        stroke: 'var(--pathlyzer-table-border)'
                                    },
                                    trail: {
                                        stroke: 'hsl(var(--muted) / 0.1);'
                                    }
                                }}>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger onMouseEnter={() => { if (popoverOpen) { setPopoverOpen(false); } setPopoverOpen(true) }} onMouseLeave={() => setPopoverOpen(false)} asChild>
                                        <Button size="rounded" disabled={!isAccessible} variant={!isAccessible ? "lockedLesson" : "accessibleLesson"}
                                            className="h-[70px] w-[70px] border-b-8">
                                            <Icon className={cn("h-10 w-10", !isAccessible ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary-foregound", isCompleted && "fill-none stroke-[4]")} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        onMouseEnter={() => setPopoverOpen(true)}
                                        onMouseLeave={() => setTimeout(() => setPopoverOpen(false), 150)}
                                        className="w-80 font-nunito"
                                    >
                                        <div className="mb-4">
                                            <h4 className="text-lg font-bold">Lesson {index + 1}:  {lessonInfo.title}</h4>
                                            <p className="text-sm">{lessonInfo.description}</p>
                                        </div>
                                        <span className="mb-10"> {getLessonStates({ lessonInfo, isCurrent, learningProgress, isAccessible, isCompleted, index, totalAmount })}</span>
                                        <PopoverArrow className="fill-gray-300 dark:fill-gray-900" />
                                    </PopoverContent>
                                </Popover>
                            </CircularProgressbarWithChildren>
                        </div>
                    ) :
                        <div className="h-[102px] w-[102px] relative">
                            <CircularProgressbarWithChildren value={learningProgress}
                                styles={{
                                    path: {
                                        stroke: 'var(--pathlyzer-table-border)'
                                    },
                                    trail: {
                                        stroke: 'hsl(var(--muted) / 0.1);'
                                    }
                                }}>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger onMouseEnter={() => { if (popoverOpen) { setPopoverOpen(false); } setPopoverOpen(true) }} onMouseLeave={() => setPopoverOpen(false)} asChild>
                                        <Button size="rounded" variant={!isAccessible ? "lockedLesson" : "accessibleLesson"}
                                            className="h-[70px] w-[70px] border-b-8">
                                            <Icon className={cn("h-10 w-10", !isAccessible ? "fill-neutral-400 text-neutral-400 stroke-neutral-400" : "fill-primary-foreground text-primary-foregound", isCompleted && "fill-none stroke-[4]")} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent onMouseEnter={() => setPopoverOpen(true)}
                                        onMouseLeave={() => setTimeout(() => setPopoverOpen(false), 150)}
                                        className="w-70 font-nunito">
                                        <h4 className="text-lg font-bold">Lesson {index + 1}:  {lessonInfo.title}</h4>
                                        <p className="text-sm">{lessonInfo.description}</p>
                                        <span className="mb-10"> {getLessonStates({ lessonInfo, isCurrent, learningProgress, isAccessible, isCompleted, index, totalAmount })}</span>
                                    </PopoverContent>
                                </Popover>
                            </CircularProgressbarWithChildren>
                        </div>
                }
            </div>
        </Link>
    );
}
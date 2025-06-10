"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LessonDto } from "@/types/types";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { PopoverArrow } from "@radix-ui/react-popover";
import { BookOpen } from "lucide-react";
import { useState } from "react";

export const AdminLesson = ({ lesson, index, totalAmount }: { lesson: LessonDto, index: number, totalAmount: number }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

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
    console.log(isLast);

    return (
        <div className="relative"
            style={{
                right: `${rightPosition}px`,
                marginTop: `${isFirst ? 60 : 24}px`,
            }}>
            <div className="h-[102px] w-[102px] relative">

                <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
                    <DropdownMenu>
                        <PopoverTrigger onMouseEnter={() => { if (popoverOpen) { setPopoverOpen(false); } setPopoverOpen(true) }} onMouseLeave={() => setPopoverOpen(false)} asChild>
                            <DropdownMenuTrigger>
                            <Button size="rounded" variant="lockedLesson"
                                className="h-[70px] w-[70px] border-b-8">
                                <BookOpen className={"h-10 w-10  text-neutral-400 stroke-neutral-400"} />
                            </Button>
                            </DropdownMenuTrigger>
                        </PopoverTrigger>
                        <PopoverContent
                            onMouseEnter={() => setPopoverOpen(true)}
                            onMouseLeave={() => setTimeout(() => setPopoverOpen(false), 150)}
                            className="w-70 font-nunito"
                        >
                            <h4 className="text-lg font-bold">Lesson {index + 1}:  {lesson.title}</h4>
                            <p className="text-sm">{lesson.description}</p>
                            <PopoverArrow className="fill-gray-300 dark:fill-gray-900" />
                        </PopoverContent>
                        <DropdownMenuContent>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </Popover>
            </div >
        </div>
    )
}
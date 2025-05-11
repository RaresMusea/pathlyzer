"use client";

import { Button } from "@/components/ui/button";
import { LessonDto } from "@/types/types";
import { Check } from "lucide-react";

export const AdminLesson = ({ lesson, index, totalAmount }: { lesson: LessonDto, index: number, totalAmount: number }) => {
    const cycleLength = 8;
    const cycleIndex = index % cycleLength;
    let indentationLevel;
    console.log(lesson);

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
                <Button size="rounded" variant="lockedLesson"
                    className="h-[70px] w-[70px] border-b-8">
                    <Check className={"h-10 w-10  text-neutral-400 stroke-neutral-400"} />
                </Button>
            </div >
        </div>
    )
}
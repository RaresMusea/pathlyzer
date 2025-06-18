"use client";

import { useEffect, useRef } from "react";
import { LearningPathItem } from "@/types/types";
import { UnitBanner } from "./UnitBanner";
import { Lesson } from "../lesson/Lesson";

export const Unit = ({ item, lives }: { item: LearningPathItem, lives: number }) => {
    const unitRef = useRef<HTMLDivElement | null>(null);

    console.log("ITEM", item);

    useEffect(() => {
        if (item.isCurrent && unitRef.current) {
            unitRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [item.isCurrent]);

    const { unit } = item;

    return (
        <div ref={unitRef} className="unitContainer">
            <UnitBanner
                currentLessonId={item.unit.lessons.find(l => l.isCurrent)?.lessonInfo.id as string}
                title={unit.name}
                description={unit.description}
                isCurrent={item.isCurrent}
                isCompleted={item.isCompleted}
            />

            <div className="flex flex-col items-center relative">
                {unit.lessons.map((lesson, index) => (
                    <Lesson
                        key={lesson.lessonInfo.id}
                        {...lesson}
                        index={index}
                        totalAmount={unit.lessons.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};
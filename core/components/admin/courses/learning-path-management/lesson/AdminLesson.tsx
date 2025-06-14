"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Brain, Trash2 } from "lucide-react";
import { LessonDto } from "@/types/types";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { LessonDeletionModal } from "./deletion/LessonDeletionModal";
import { useRouter } from "next/navigation";

export const AdminLesson = ({
    courseId,
    lesson,
    index,
}: {
    courseId: string;
    lesson: LessonDto;
    index: number;
}) => {
    const [lessonDeletionModalOpen, setLessonDeletionModalOpen] = useState(false);
    const router = useRouter();

    const cycleLength = 8;
    const cycleIndex = index % cycleLength;

    const indentationLevel =
        cycleIndex <= 2
            ? cycleIndex
            : cycleIndex <= 4
                ? 4 - cycleIndex
                : cycleIndex <= 6
                    ? 4 - cycleIndex
                    : cycleIndex - 8;

    const rightPosition = indentationLevel * 40;
    const isFirst = index === 0;

    return (
        <div
            className="relative"
            style={{
                right: `${rightPosition}px`,
                marginTop: `${isFirst ? 60 : 24}px`,
            }}
        >
            <div className="h-[102px] w-[102px] relative">

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <div
                        >
                            <Button
                                size="rounded"
                                variant="lockedLesson"
                                className="h-[70px] w-[70px] border-b-8"
                            >
                                <BookOpen className="h-10 w-10 text-neutral-400 stroke-neutral-400" />
                            </Button>
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent side="bottom" align="start" sideOffset={8} className="font-nunito">
                        <div className="p-2">Lesson {index + 1}: {lesson.title}
                        </div>
                        <DropdownMenuSeparator className="border-b"/>
                        <DropdownMenuItem onSelect={() => {router.push(`/admin/courses/${courseId}/learning-path/lessons/${lesson.id}/practice`)}}>
                            <Brain className="mr-2 h-4 w-4" />
                            Manage learning practice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onSelect={() => setLessonDeletionModalOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4 " />
                            Delete lesson
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <LessonDeletionModal open={lessonDeletionModalOpen} lessonId={lesson.id} setOpen={setLessonDeletionModalOpen} lessonTitle={lesson.title} />
        </div>
    );
};

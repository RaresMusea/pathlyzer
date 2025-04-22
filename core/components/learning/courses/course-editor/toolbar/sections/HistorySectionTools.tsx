"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Redo, Undo } from "lucide-react";

export const HistorySectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={!editor?.can().undo()}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Undo last action
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={!editor?.can().redo()}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Redo last action
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
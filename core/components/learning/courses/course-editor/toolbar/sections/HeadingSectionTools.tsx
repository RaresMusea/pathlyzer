"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Heading1, Heading2, Heading3 } from "lucide-react";

export const HeadingSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 1 })}
                        onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("heading", { level: 1 }) ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <Heading1 className={`h-4 w-4 ${editor?.isActive('heading', { level: 1 }) ? 'text-white' : ''}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Apply a level 1 heading
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 2 })}
                        onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("heading", { level: 2 }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
                    >
                        <Heading2 className={`h-4 w-4 ${editor?.isActive('heading', { level: 2 }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Apply a level 2 heading
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("heading", { level: 3 })}
                        onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("heading", { level: 3 }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
                    >
                        <Heading3 className={`h-4 w-4 ${editor?.isActive('heading', { level: 3 }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Apply a level 3 heading
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
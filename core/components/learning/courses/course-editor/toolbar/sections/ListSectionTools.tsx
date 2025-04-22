"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { List, ListChecks, ListOrdered } from "lucide-react";

export const ListSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("bulletList")}
                        onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("bulletList") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <List className={`h-4 w-4 ${editor?.isActive('bulletList') && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Toggle an unordered, bullet list
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("orderedList")}
                        onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("orderedList") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <ListOrdered className={`h-4 w-4 ${editor?.isActive('orderedList') && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Toggle a numeric-ordered list
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("taskList")}
                        onPressedChange={() => editor?.chain().focus().toggleTaskList().run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("taskList") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <ListChecks className={`h-4 w-4 ${editor?.isActive('taskList') && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Toggle a list of tasks
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
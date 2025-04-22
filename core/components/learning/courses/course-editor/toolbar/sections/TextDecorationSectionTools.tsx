"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Bold, Italic, Underline } from "lucide-react";

export const TextDecorationSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("bold")}
                        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("bold") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <Bold className={`h-4 w-4 ${editor?.isActive('bold') && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    <strong>Bold</strong> font
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive("italic")}
                        onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("italic") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <Italic className={`h-4 w-4 ${editor?.isActive('italic') && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    <em>Italic</em> font
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                <Toggle
                    size="sm"
                    pressed={editor?.isActive("underline")}
                    onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("underline") ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                >
                    <Underline className={`h-4 w-4 ${editor?.isActive('underline') && 'text-white'}`} />
                </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    <u>Underlined</u> font
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
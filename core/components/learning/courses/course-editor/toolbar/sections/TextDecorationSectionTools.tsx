"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Bold, Italic, Underline } from "lucide-react";

export const TextDecorationSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Toggle
                size="sm"
                pressed={editor?.isActive("bold")}
                onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("bold") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive("italic")}
                onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("italic") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive("underline")}
                onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("underline") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Underline className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

export const TextAlignmentSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: "left" })}
                onPressedChange={() => editor?.chain().focus().setTextAlign("left").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "left" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: "center" })}
                onPressedChange={() => editor?.chain().focus().setTextAlign("center").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "center" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: "right" })}
                onPressedChange={() => editor?.chain().focus().setTextAlign("right").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "right" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive({ textAlign: "justify" })}
                onPressedChange={() => editor?.chain().focus().setTextAlign("justify").run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "justify" }) ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <AlignJustify className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
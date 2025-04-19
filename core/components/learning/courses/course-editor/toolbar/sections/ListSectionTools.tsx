"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { List, ListChecks, ListOrdered } from "lucide-react";

export const ListSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Toggle
                size="sm"
                pressed={editor?.isActive("bulletList")}
                onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("bulletList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <List className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive("orderedList")}
                onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("orderedList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor?.isActive("taskList")}
                onPressedChange={() => editor?.chain().focus().toggleTaskList().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive("taskList") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <ListChecks className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Redo, Undo } from "lucide-react";

export const HistorySectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
            >
                <Undo className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
            >
                <Redo className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
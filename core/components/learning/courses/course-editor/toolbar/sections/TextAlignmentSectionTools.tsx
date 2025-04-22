"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";

export const TextAlignmentSectionTools = () => {
    const { editor } = useCourseBuilder();

    return (
        <>
            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: "left" })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign("left").run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "left" }) ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <AlignLeft className={`h-4 w-4 ${editor?.isActive({ textAlign: 'left' }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Text alignment: left
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: "center" })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign("center").run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "center" }) ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <AlignCenter className={`h-4 w-4 ${editor?.isActive({ textAlign: 'center' }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Text alignment: center
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: "right" })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign("right").run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "right" }) ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <AlignRight className={`h-4 w-4 ${editor?.isActive({ textAlign: 'right' }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Text alignment: right
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: "justify" })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign("justify").run()}
                        className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor?.isActive({ textAlign: "justify" }) ? '!bg-[var(--pathlyzer-table-border)]' : ''}`}
                    >
                        <AlignJustify className={`h-4 w-4 ${editor?.isActive({ textAlign: 'justify' }) && 'text-white'}`} />
                    </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-nunito w-32 text-center dark:bg-gray-700 bg-gray-100 text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                    Text alignment: justify
                </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
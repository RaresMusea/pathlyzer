"use client";

import {
    ImageIcon,
    Pilcrow,
    Info,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCourseBuilder } from "@/context/CourseBuilderContext"
import { HistorySectionTools } from "./sections/HistorySectionTools";
import { HeadingSectionTools } from "./sections/HeadingSectionTools";
import { TextDecorationSectionTools } from "./sections/TextDecorationSectionTools";
import { TextAlignmentSectionTools } from "./sections/TextAlignmentSectionTools";
import { ListSectionTools } from "./sections/ListSectionTools";
import { CodeSectionTools } from "./sections/CodeSectionTools";

export default function CourseEditorToolbar() {
    const { editor } = useCourseBuilder();

    if (!editor) {
        return <p>Invalid editor</p>
    }

    const addImage = () => {
        const url = window.prompt("Enter the URL of the image:")

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-gray-50 dark:bg-[#2A2D33] text-gray-900 dark:text-white">
            <HistorySectionTools />
            <HeadingSectionTools />
            <TextDecorationSectionTools />
            <TextAlignmentSectionTools />
            <ListSectionTools />
            <CodeSectionTools />


            {/* Alert dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span>Alert</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>Info</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Warning</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>Error</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { }} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Success</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Button variant="ghost" size="sm" onClick={addImage} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <ImageIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />

            <Toggle
                size="sm"
                pressed={editor.isActive("paragraph")}
                onPressedChange={() => editor.chain().focus().setParagraph().run()}
                className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive("paragraph") ? 'bg-blue-500 dark:bg-blue-600' : ''}`}
            >
                <Pilcrow className="h-4 w-4" />
            </Toggle>
        </div>
    )
}
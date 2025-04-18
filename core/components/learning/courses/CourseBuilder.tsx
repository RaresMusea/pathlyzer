"use client";

import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { useState } from "react";
import CourseEditorToolbar from "./course-editor/CourseEditorToolbar";
import { CoursePreview } from "./course-editor/CoursePreview";
import { useCourseBuilder } from "@/context/CourseBuilderContext";


export const CourseBuilder = () => {
    const [exportedContent, setExportedContent] = useState<JSONContent>();
    const { editor } = useCourseBuilder();

    const exportToTSX = () => {
        if (!editor) return

        const json = editor.getJSON();

        // Create a DOM parser to work with the HTML
        // const parser = new DOMParser()
        // const doc = parser.parseFromString(html, "text/html")

        // const processedHtml = doc.body.innerHTML

        setExportedContent(json);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 font-nunito">Course Content Editor</h1>

            <div className="border rounded-lg overflow-hidden mb-6 shadow-md flex flex-col">
                <div className="sticky top-0 z-10">
                    <CourseEditorToolbar />
                </div>
                <div className="p-4 h-[500px] overflow-y-auto bg-white dark:bg-[#23262B] font-nunito">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Button onClick={() => { exportToTSX() }}>
                    <FileCode className="mr-2 h-4 w-4" />
                    Export to TSX
                </Button>
            </div>

            {exportedContent && (
                <div className="font-nunito">
                    <h2 className="mb-4">Course Preview</h2>
                    <CoursePreview content={exportedContent} />
                </div>
            )}
        </div>
    );
}
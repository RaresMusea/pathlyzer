"use client";

import { EditorContent, JSONContent } from "@tiptap/react";
import CourseEditorToolbar from "./course-editor/toolbar/CourseEditorToolbar";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { useCallback } from "react";

export const CourseEditor = ({ setExportedContent }: { setExportedContent: (newContent: JSONContent) => void; }) => {
    const { editor } = useCourseBuilder();

    const exportToJson = useCallback(() => {
        if (!editor) return

        const json = editor.getJSON();

        // Create a DOM parser to work with the HTML
        // const parser = new DOMParser()
        // const doc = parser.parseFromString(html, "text/html")

        // const processedHtml = doc.body.innerHTML

        setExportedContent(json);
    }, [editor, setExportedContent]);

    return (
        <>
            <div className="border rounded-lg overflow-hidden mb-6 shadow-md flex flex-col">
                <div className="sticky top-0 z-10">
                    <CourseEditorToolbar />
                </div>
                <div className="p-4 h-[500px] overflow-y-auto bg-white dark:bg-[#23262B] font-nunito">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Button onClick={() => { exportToJson() }}>
                    <FileCode className="mr-2 h-4 w-4" />
                    Export to TSX
                </Button>
            </div>
        </>
    );
}
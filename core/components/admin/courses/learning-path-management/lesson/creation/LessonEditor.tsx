"use client";

import CourseEditorToolbar from "@/components/learning/courses/course-editor/toolbar/CourseEditorToolbar";
import { CoursePreview } from "@/components/learning/courses/course-preview/CoursePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor, EditorContent, JSONContent } from "@tiptap/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LessonEditor = ({ editor }: { editor: Editor | null }) => {

    const [exportedContent, setExportedContent] = useState<JSONContent>();
    const [activeTab, setActiveTab] = useState("editor");

    const onExportedContent = () => {
        setExportedContent(editor?.getJSON());
    }

    useEffect(() => {
        if (activeTab === 'preview') {
            setExportedContent(editor?.getJSON());
        }
    }, [activeTab])

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className="w-full"
        >
            <h4 className="text-lg my-3">Use the editor to build the core learning material for this lesson.</h4>
            <Tabs defaultValue="editor" onValueChange={setActiveTab} className="w-full h-full">
                <TabsList className="grid mx-auto w-[70%] grid-cols-2">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                    <div className="border rounded-lg overflow-hidden mb-6 shadow-md mt-6 flex flex-col">
                        <div className="sticky top-0 z-10">
                            <CourseEditorToolbar />
                        </div>
                        <div className="p-4 h-[500px] overflow-y-auto bg-white dark:bg-muted/40 font-nunito">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            {activeTab === "preview" && exportedContent && (
                <div className="mt-10">
                    <CoursePreview content={exportedContent} />
                </div>
            )}
        </motion.div>
    )
}
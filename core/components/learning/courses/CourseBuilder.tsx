"use client";

import { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { CoursePreview } from "./course-editor/CoursePreview";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Spinner } from "@heroui/spinner";
import { CourseEditor } from "./CourseEditor";

export const CourseBuilder = () => {
    const [exportedContent, setExportedContent] = useState<JSONContent>();
    const { editor } = useCourseBuilder();

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 font-nunito">Course Content Editor</h1>
            {editor ?
                <>
                    <CourseEditor setExportedContent={setExportedContent} />
                </>
                :
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
                    <Spinner color="default" label="Starting course editor..." labelColor="foreground" />
                </div>
            }

            {exportedContent && (
                <div className="font-nunito">
                    <h2 className="mb-4">Course Preview</h2>
                    <CoursePreview content={exportedContent} />
                </div>
            )}
        </div>
    );
}
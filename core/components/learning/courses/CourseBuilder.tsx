"use client";

import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const CourseBuilder = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Course Builder</p>',
    })

    return (
        <div className="flex items-center justify-center mt-12">
            <EditorContent editor={editor}/>
        </div>
    );
}
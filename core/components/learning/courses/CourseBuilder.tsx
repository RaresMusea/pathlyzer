"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { all, createLowlight } from "lowlight";
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("javascript", js);
lowlight.register("typescript", ts);
lowlight.register("java", java);
lowlight.register("json", json);
lowlight.register("python", python);


export const CourseBuilder = () => {
    const [exportedContent, setExportedContent] = useState<string>("");

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
        extensions: [
            StarterKit,
            TaskItem.configure({
                nested: true,
            }),
            TaskList,
            Table,
            TableCell,
            TableRow,
            TableHeader,
            Image,
            ImageResize
        ],
        content: `<table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colspan="3">Description</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Singer</td>
              <td>Songwriter</td>
              <td>Actress</td>
            </tr>
          </tbody>
        </table>`,
    })

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 font-nunito">Course Content Editor</h1>

            <div className="border rounded-lg overflow-hidden mb-6 shadow-md flex flex-col">
                <div className="sticky top-0 z-10">
                    {/* <CourseEditorToolbar editor={editor}/> */}
                </div>
                <div className="p-4 h-[500px] overflow-y-auto bg-white dark:bg-[#23262B]">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <Button onClick={() => { }}>
                    <FileCode className="mr-2 h-4 w-4" />
                    Export to TSX
                </Button>
            </div>

            {exportedContent && (
                <Tabs defaultValue="code">
                    <TabsList>
                        <TabsTrigger value="code">TSX Code</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="code">
                        <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto max-h-[400px]">
                            <pre className="text-sm">{exportedContent}</pre>
                        </div>
                    </TabsContent>
                    <TabsContent value="preview">
                        {/* <CodePreview code={exportedContent} /> */}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
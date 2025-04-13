"use client";

import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import ImageResize from "tiptap-extension-resize-image";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import { Button } from "@/components/ui/button";
import { FileCode } from "lucide-react";
import { useState } from "react";
import CourseEditorToolbar from "./course-editor/CourseEditorToolbar";
import TiptapAlert from "./course-editor/tiptap/TiptapAlert";
import { CoursePreview } from "./course-editor/CoursePreview";
import { CodeGroupExtension } from "./course-editor/tiptap/CodeGroupExtension";


export const CourseBuilder = () => {
    const [exportedContent, setExportedContent] = useState<JSONContent>();
    const [language, setLanguage] = useState<string>('javascript');

    const editor = useEditor({
        editorProps: {
            attributes: {
                class: "focus:outline-none",
                spellcheck: 'false',
            },
        },
        extensions: [
            StarterKit.configure({ codeBlock: false, paragraph: false, heading: false }),
            TaskItem.configure({
                nested: true,
            }),
            Paragraph.extend({
                addAttributes() {
                    return {
                        textAlign: {
                            default: 'left',
                            parseHTML: element => element.style.textAlign || 'left',
                            renderHTML: attributes => {
                                return { style: `text-align: ${attributes.textAlign}` }
                            },
                        },
                    }
                },
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Heading.extend({
                addAttributes() {
                    return {
                        level: {
                            default: 1,
                            parseHTML: element => {
                                const tagName = element.tagName.toLowerCase();
                                const match = tagName.match(/^h(\d+)$/);
                                return match ? parseInt(match[1], 10) : 1;
                            },
                            renderHTML: attributes => {
                                return { level: attributes.level || 1 };
                            },
                        },
                        textAlign: {
                            default: 'left',
                            parseHTML: element => element.style.textAlign || 'left',
                            renderHTML: attributes => {
                                return { style: `text-align: ${attributes.textAlign}` }
                            },
                        },
                    }
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Underline,
            TaskList,
            Table,
            TableCell,
            TableRow,
            TableHeader,
            Image,
            ImageResize,
            TiptapAlert,
            CodeBlockShiki.configure({
                defaultLanguage: "ts",
                defaultTheme: 'catppuccin-mocha',
                HTMLAttributes: {
                    class: 'p-4 my-4 bg-gray-800 text-gray-100 rounded overflow-auto'
                }
            }),
            CodeGroupExtension,

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
        immediatelyRender: false
    })

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
                    <CourseEditorToolbar editor={editor} language={language} setLanguage={setLanguage} />
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
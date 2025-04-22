"use client";

import { CodeGroupExtension } from "@/components/learning/courses/course-editor/tiptap/CodeGroupExtension";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createContext, useContext, useEffect, useState } from "react";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import ImageResize from "tiptap-extension-resize-image";


interface CourseBuilderContextProps {
    editor: Editor | null;
    language: string;
    setLanguage: (newLanguage: string) => void;
};

const CourseBuilderContext = createContext<CourseBuilderContextProps | undefined>(undefined);

export const CourseBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('txt');
    const [isCodeBlock, setIsCodeBlock] = useState<boolean>(false);
    const [isCodeGroup, setIsCodeGroup] = useState<boolean>(false);



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
            CodeBlockShiki
                .configure({
                    defaultLanguage: "ts",
                    defaultTheme: "catppuccin-mocha",
                    HTMLAttributes: {
                        class: 'p-4 my-4 bg-gray-800 text-gray-100 rounded overflow-auto codePreFormat'
                    }
                })
                .extend({
                    addAttributes() {
                        return {
                            language: {
                                default: "txt",
                                parseHTML: element => element.getAttribute("data-language") || "txt",
                                renderHTML: attributes => ({
                                    "data-language": attributes.language || "txt"
                                })
                            }
                        }
                    },
                    renderHTML({ node, HTMLAttributes }) {
                        return [
                            "pre",
                            {
                                ...HTMLAttributes,
                                "data-language": node.attrs.language || "txt",
                                class: "p-4 my-4 bg-gray-800 text-gray-100 rounded overflow-auto codePreFormat",
                            },
                            ["code", 0],
                        ]
                    },
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
    });

    useEffect(() => {
        if (!editor) return;

        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        const node = $from.node();

        console.log("NODE", node);

        if (node && (node.type.name === "codeBlock" || node.type.name === 'codeGroup')) {
            const pos = $from.before();
            console.log("POS", pos);
            
            if (typeof pos === 'number') {
                editor
                    .chain()
                    .focus()
                    .command(({ tr }) => {
                        tr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            language,
                        });
                        return true;
                    })
                    .run();
            }
        }
    }, [language, editor]);

    useEffect(() => {
        if (!editor) return

        const handler = () => {
            const { state } = editor
            const { doc, selection } = state
            const { $from } = selection

            const node = $from.node()
            if (node.type.name === 'codeBlock' && node.attrs.language) {
                setLanguage(node.attrs.language)
            }
        }

        editor.on('transaction', handler)

        return () => {
            editor.off('transaction', handler)
        }
    }, [editor]);

    return (
        <CourseBuilderContext.Provider value={{
            editor,
            language,
            setLanguage
        }}>
            {children}
        </CourseBuilderContext.Provider>
    );

}

export const useCourseBuilder = () => {
    const context = useContext(CourseBuilderContext);

    if (!context) {
        throw new Error('useCourseBuilder() must be used within a CourseBuilderProvider!');
    }

    return context;
};
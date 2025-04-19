"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { Code, Group } from "lucide-react";
import { useCallback } from "react";

export const CodeSectionTools = () => {
    const { editor, language, setLanguage } = useCourseBuilder();

    const setCodeBlock = useCallback(() => {
        if (editor) {
            const { state, view } = editor;
            const { selection } = state;
            const { $from, empty } = selection;

            if (empty) {
                const codeBlockNode = editor.schema.nodes.codeBlock.create(
                    { language: language },
                    editor.schema.text("// code block")
                );

                const tr = state.tr.replaceSelectionWith(codeBlockNode);
                view.dispatch(tr);
            } else {
                const node = $from.node();

                if (node.type.name === 'codeBlock') {
                    const newAttrs = { ...node.attrs, language: 'javascript' };
                    const pos = $from.pos;

                    const tr = state.tr.setNodeMarkup(pos, undefined, newAttrs);
                    view.dispatch(tr);
                } else {
                    const codeBlockNode = editor.schema.nodes.codeBlock.create(
                        { language: language },
                        editor.schema.text("// code block")
                    );
                    const tr = state.tr.replaceSelectionWith(codeBlockNode);
                    view.dispatch(tr);
                }
            }
        }
    }, [editor, language]);

    const addCodeGroup = useCallback(() => {
        if (editor) {
            editor.chain().focus().insertContent([
                {
                    type: 'codeGroup',
                    content: []
                },
                {
                    type: 'paragraph'
                }
            ]).run();
            setLanguage('txt');
        }
    }, [editor, setLanguage]);

    if (!editor) {
        return null;
    }

    const isCodeGroup: boolean | undefined = editor.isActive('codeGroup');
    const isCodeBlock: boolean | undefined = editor.isActive("codeBlock") && !editor.isActive('codeGroup');

    return (
        <>
            <Toggle size="sm" pressed={isCodeBlock} onPressedChange={setCodeBlock} className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${isCodeBlock ? 'bg-blue-500 dark:bg-blue-600' : ''}`}>
                <Code className="h-4 w-4" />
            </Toggle>

            <Toggle size="sm" pressed={isCodeGroup} onPressedChange={addCodeGroup} className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${isCodeGroup ? 'bg-blue-500 dark:bg-blue-600' : ''}`}>
                <Group className="h-4 w-4 mr-1" /> Code Group
            </Toggle>

            {(isCodeBlock || isCodeGroup) && (
                <Select value={language || "txt"} onValueChange={setLanguage}>
                    <SelectTrigger className="h-8 w-40 bg-gray-100 dark:bg-gray-700">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="txt">Plain Text</SelectItem>
                        <SelectItem value="js">JavaScript</SelectItem>
                        <SelectItem value="jsx">JSX</SelectItem>
                        <SelectItem value="ts">TypeScript</SelectItem>
                        <SelectItem value="tsx">TSX</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="py">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                    </SelectContent>
                </Select>
            )}

            <Separator orientation="vertical" className="mx-1 h-6 border-gray-300 dark:border-gray-700 dark:bg-gray-500" />
        </>
    )
}
"use client";

import { Button } from "@/components/ui/button";
import { useCourseBuilder } from "@/context/CourseBuilderContext";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const CodeGroupEditor = ({ editor, getPos, node }: NodeViewProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(0);
    const [numberOfBlocks, setNumberOfBlocks] = useState<number>(0);
    const { setLanguage } = useCourseBuilder();


    const getLanguageAtIndex = (index: number): string => {
        const codeBlockNode = node.content.content[index];
        if (codeBlockNode?.type.name === "codeBlock") {
            return codeBlockNode.attrs.language;
        }
        return 'txt';
    };

    const addNewSnippet = () => {
        const { state, view } = editor
        const { tr, schema } = state

        const position = typeof getPos === "function" ? getPos() : null
        if (position === null) return

        const newSnippet = schema.nodes.codeBlock.create(
            { language: 'txt' },
            schema.text("// new snippet")
        )

        const insertPos = getPos() + node.nodeSize - 1;
        const transaction = tr.insert(insertPos, newSnippet)
        view.dispatch(transaction)
        setNumberOfBlocks(numberOfBlocks + 1);
    };

    useEffect(() => {
        console.log(getLanguageAtIndex(selectedBlockIndex));
        setLanguage(getLanguageAtIndex(selectedBlockIndex));
    }, [selectedBlockIndex])

    useEffect(() => {
        const dom = editor?.view?.dom

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && e.ctrlKey) {
                const pos = getPos?.();
                if (pos !== null && typeof pos === "number") {
                    e.preventDefault();

                    const insertPos = pos + node.nodeSize;

                    editor.chain()
                        .focus()
                        .insertContentAt(insertPos, { type: 'paragraph' })
                        .run();

                    setTimeout(() => {
                        editor.chain()
                            .focus()
                            .setTextSelection(insertPos + 1)
                            .run();
                    }, 0);
                }
            }
        };

        dom?.addEventListener("keydown", handleKeyDown);
        return () => dom?.removeEventListener("keydown", handleKeyDown);
    }, [editor, getPos, node]);

    useEffect(() => {
        const pos = editor.state.selection.from;
        const groupPos = typeof getPos === "function" ? getPos() : null;
        if (groupPos === null) return;

        const relativePos = pos - groupPos;

        let index = -1;
        node.forEach((child, childOffset, i) => {
            const start = childOffset;
            const end = childOffset + child.nodeSize;
            if (relativePos >= start && relativePos <= end) {
                index = i;
            }
        });

        setSelectedBlockIndex(index);
    }, [editor.state.selection]);


    return (
        <NodeViewWrapper ref={wrapperRef}>
            <div className="flex items-center justify-end mb-3">
                <Button variant="default" onClick={addNewSnippet} className="bg-[--pathlyzer-table-border] text-white">
                    <PlusCircle className="mr-2" />
                    Add new snippet
                </Button>
            </div>
            <div className={`${numberOfBlocks > 0 && 'border border-[--pathlyzer-table-border] rounded-md p-4'}`}>
                <NodeViewContent />
            </div>
        </NodeViewWrapper>
    )
}
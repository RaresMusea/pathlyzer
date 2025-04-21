"use client";

import { JSONContent } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { CodeBlock, ICodeBlock } from "./code-section-preview/CodeBlock";
import { serializeCourseContent } from "../course-editor/serialization/CourseContentSerializer";
import { CodeGroup, ICodeGroup } from "./code-section-preview/CodeGroup";

type CoursePreviewProps = {
    content: JSONContent;
}

export const CoursePreview = (props: CoursePreviewProps) => {
    const [html, setHtml] = useState<string>("")
    const [processedContent, setProcessedContent] = useState<JSX.Element | null>(null)

    useEffect(() => {
        console.log(props.content);
        const convert = async () => {
            const result: string = await serializeCourseContent(props.content)
            setHtml(`<div className='prose'>${result}</div>`);
        }

        convert()
    }, [props.content]);

    const renderCodeBlocks = useCallback((codeBlockElems: Element[]) => {
        codeBlockElems.forEach((block) => {
            const language = block.getAttribute("data-language") || "txt"
            const code = decodeURIComponent(block.getAttribute("data-code") || "")
            const highlightedHtml = decodeURIComponent(block.getAttribute("data-html") || "")

            const codeBlockElement = document.createElement("div")
            block.parentNode?.replaceChild(codeBlockElement, block)

            import("react-dom/client").then(({ createRoot }) => {
                const root = createRoot(codeBlockElement)
                root.render(<CodeBlock code={code} language={language} html={highlightedHtml} />)
            })
        });
    }, []);

    const renderCodeGroups = useCallback((groupElems: Element[]) => {

        groupElems.forEach((elem) => {
            const groupId = elem.getAttribute("data-group-id") || crypto.randomUUID();
            const blockElements = elem.querySelectorAll("[data-code-block]");

            const blocks: ICodeBlock[] = Array.from(blockElements).map((blockEl) => ({
                code: decodeURIComponent(blockEl.getAttribute("data-code") || ""),
                language: blockEl.getAttribute("data-language") || "txt",
                html: decodeURIComponent(blockEl.getAttribute("data-html") || ""),
            }));

            const group: ICodeGroup = { id: parseInt(groupId), blocks };

            const codeGroupElement = document.createElement("div");
            elem.parentNode?.replaceChild(codeGroupElement, elem);

            import("react-dom/client").then(({ createRoot }) => {
                const root = createRoot(codeGroupElement);
                root.render(<CodeGroup blocks={group.blocks} id={group.id} />);
            });
        });
    }, []);

    useEffect(() => {
        if (!html) return

        const tempDiv = document.createElement("div")
        tempDiv.classList.add('leading-relaxed')
        tempDiv.innerHTML = html

        const codeBlocks = tempDiv.querySelectorAll("[data-code-block]")

        codeBlocks.forEach((block) => {
            const id = `code-block-${Math.random().toString(36).substring(2, 9)}`
            block.id = id
        });

        const finalContent = (
            <div
                dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
                ref={(containerRef) => {
                    if (!containerRef) return
                    const allCodeBlocks = containerRef.querySelectorAll("[data-code-block]");
                    const standaloneBlocks = Array.from(allCodeBlocks).filter(
                        (block) => !block.closest("[data-code-group]")
                    );
                    const groupedBlocks = Array.from(containerRef.querySelectorAll("[data-code-group]"));

                    renderCodeBlocks(standaloneBlocks);
                    renderCodeGroups(groupedBlocks);
                }}
            />
        )

        setProcessedContent(finalContent);
    }, [html, renderCodeBlocks, renderCodeGroups]);

    return processedContent || <div>Loading</div>
}
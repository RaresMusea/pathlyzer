"use client";

import { JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { CodeBlock } from "../course-preview/CodeBlock";
import { serializeCouseContent } from "./serialization/CourseContentSerializer";

type CoursePreviewProps = {
    content: JSONContent;
}

export const CoursePreview = (props: CoursePreviewProps) => {
    const [html, setHtml] = useState<string>("")
    const [processedContent, setProcessedContent] = useState<JSX.Element | null>(null)

    useEffect(() => {
        console.log(props.content);
        const convert = async () => {
            const result: string = await serializeCouseContent(props.content)
            setHtml(result)
        }

        convert()
    }, [props.content]);


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

                    const renderedCodeBlocks = containerRef.querySelectorAll("[data-code-block]")

                    renderedCodeBlocks.forEach((block) => {
                        const language = block.getAttribute("data-language") || "txt"
                        const code = decodeURIComponent(block.getAttribute("data-code") || "")
                        const highlightedHtml = decodeURIComponent(block.getAttribute("data-html") || "")

                        const codeBlockElement = document.createElement("div")
                        block.parentNode?.replaceChild(codeBlockElement, block)

                        import("react-dom/client").then(({ createRoot }) => {
                            const root = createRoot(codeBlockElement)
                            root.render(<CodeBlock code={code} language={language} html={highlightedHtml} />)
                        })
                    })
                }}
            />
        )

        setProcessedContent(finalContent)
    }, [html]);

    return processedContent || <div>Loading</div>
}
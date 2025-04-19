import { JSONContent } from "@tiptap/react";
import { BundledLanguage, BundledTheme, createHighlighter, HighlighterGeneric } from "shiki";

export const availableLanguages: string[] = ["ts", "js", "html", "css", "json", "txt", "java", "tsx", "jsx", "xml", "csharp", 'c++', 'py'];

export const getCodeHighlighter = async () => {
    const highlighter = await createHighlighter({
        themes: ["catppuccin-mocha"],
        langs: availableLanguages
    });

    return highlighter;
}

export async function serializeCourseContent(doc: JSONContent): Promise<string> {
    const highlighter: HighlighterGeneric<BundledLanguage, BundledTheme> = await getCodeHighlighter();
    let codeGroupsCounter: number = 0;

    return (doc.content || []).map(processNode).join("\n");

    function processNode(node: JSONContent): string {
        switch (node.type) {
            case "codeBlock":
                return processCodeBlock(node, highlighter);
            case "codeGroup":
                return processCodeGroup(node, highlighter, codeGroupsCounter++);
            case "paragraph":
                const alignment: string = node.attrs?.textAlign;
                const content: string = node.content?.map(processNode).join("") || '';
                return wrapWithTag('p', content, { className: 'tiptap', style: alignment ? `text-align: ${alignment};` : undefined });
            case "text":
                return processTextNode(node);
            case "table":
                return wrapWithTag("table", node.content?.map(processNode).join("") || "");
            case "tableRow":
                return wrapWithTag("tr", node.content?.map(processNode).join("") || "");
            case "tableHeader":
            case "tableCell":
                return processTableCell(node);
            case "heading":
                return processHeading(node);
            case "bulletList":
            case "orderedList":
            case "taskList":
                return processList(node);
            case "listItem":
            case "taskItem":
                return processListItem(node);
            case "image":
                return processImage(node);
            default:
                return "";
        }
    }

    function processCodeBlock(node: JSONContent, highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>): string {
        const code = node.content?.[0]?.text || "";
        const lang = node.attrs?.language || "txt";
        const highlightedHtml = highlighter.codeToHtml(code, { lang, theme: "catppuccin-mocha" });
        return `<div data-code-block data-language="${lang}" data-code="${encodeURIComponent(code)}" data-html="${encodeURIComponent(highlightedHtml)}"></div>`;
    }

    function processCodeGroup(node: JSONContent, highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>, codeGroupId: number): string {
        const blocks = node.content || [];

        const renderedBlocks = blocks
            .map((block, idx) => {
                const code = block.content?.[0]?.text || "";
                const lang = block.attrs?.language || "txt";
                const highlightedHtml = highlighter.codeToHtml(code, {
                    lang,
                    theme: "catppuccin-mocha",
                });

                return `
                        <div 
                            data-code-block 
                            data-language="${lang}" 
                            data-code="${encodeURIComponent(code)}" 
                            data-html="${encodeURIComponent(highlightedHtml)}"
                            data-block-index="${idx}">
                        </div>
                `;
            }).join("\n");

        return `<div data-code-group data-group-id="${codeGroupId}">${renderedBlocks}</div>`;
    }

    function processTextNode(node: JSONContent): string {
        let text = node.text || "";
        if (node.marks) {
            for (const mark of node.marks) {
                switch (mark.type) {
                    case "bold":
                        text = wrapWithTag("strong", text);
                        break;
                    case "italic":
                        text = wrapWithTag("em", text);
                        break;
                    case "underline":
                        text = wrapWithTag("u", text);
                        break;
                    case "code":
                        text = wrapWithTag("code", text);
                        break;
                }
            }
        }
        return text;
    }

    function processTableCell(node: JSONContent): string {
        const content = node.content?.map(processNode).join("") || "";
        const rowspan = node.attrs?.rowspan ? ` rowspan="${node.attrs.rowspan}"` : "";
        const colspan = node.attrs?.colspan ? ` colspan="${node.attrs.colspan}"` : "";
        const tag = node.type === "tableHeader" ? "th" : "td";
        return `<${tag}${rowspan}${colspan}>${content}</${tag}>`;
    }

    function processList(node: JSONContent): string {
        const items = (node.content || []).map(processNode).join("");

        if (node.attrs?.type === "taskList" || node.type === "taskList") {
            return `<ul data-type="taskList" style="list-style-type: none; margin-left: 0; padding: 0;">${items}</ul>`;
        }

        if (node.type === "bulletList") {
            return `<ul style="list-style-type: disc; padding-left: 1.5em;">${items}</ul>`;
        }

        if (node.type === "orderedList") {
            return `<ol style="list-style-type: decimal; padding-left: 1.5em;">${items}</ol>`;
        }

        return items;
    }

    function processListItem(node: JSONContent): string {
        const isTask = node.attrs?.checked !== undefined;
        const content = (node.content || []).map(processNode).join("");

        if (isTask) {
            const checked = node.attrs?.checked ? "checked" : "";
            return `
            <li data-type="taskItem">
                <input type="checkbox" disabled ${checked} />
                <div>${content}</div>
            </li>
            `;
        }

        return `<li>${content}</li>`;
    }

    function processHeading(node: JSONContent): string {
        const level: number = Math.min(Math.max(node.attrs?.level || 1, 1), 6);
        const tag: string = `h${level}`;
        const alignment: string = node.attrs?.textAlign;
        const content: string = node.content?.map(processNode).join("") || "";
        return `<${tag} class="tiptap" align= ${alignment}>${content}</${tag}>`;
    }

    function processImage(node: JSONContent): string {
        console.log("IMAGE NODE", node);
        const styles = node.attrs?.style;
        const src = node.attrs?.src || "";
        const alt = node.attrs?.alt || "Course image";

        return `
            <img 
                src="${src}" 
                alt="${alt}" 
                style="${styles}" 
            />
        `;
    }

    function wrapWithTag(tag: string, content: string, options?: { className?: string; style?: string; }): string {
        const classAttr = options?.className ? ` class="${options.className}"` : "";
        const styleAttr = options?.style ? ` style="${options.style}"` : "";
        return `<${tag}${classAttr}${styleAttr}>${content}</${tag}>`;
    }
}
"use client";

import { Tabs, Tab } from "@heroui/tabs";

import { CodeBlock, ICodeBlock } from "./CodeBlock";
import { getLanguageByAbbr } from "@/lib/Code";
import { useCallback, useState } from "react";
import Image from "next/image";
import { getIconForFile } from "vscode-icons-js";

export interface ICodeGroup {
    id: number;
    blocks: ICodeBlock[];
}

export const CodeGroup = (group: ICodeGroup) => {

    const getLanguageIcon = useCallback((language: string): string => {
        const icon = getIconForFile(`Document.${language.toLowerCase()}`);
        return `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${icon}`;
    }, [])

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    if (!group.blocks || group.blocks.length === 0) {
        return null;
    }
    return (
        <>
            <Tabs variant="underlined" onSelectionChange={(k) => setSelectedIndex(Number(k))}>
                {
                    group.blocks.map((b, index) => (
                        <Tab key={index} title={
                            <div className="flex items-center space-x-1">
                                <Image src={getLanguageIcon(b.language)} width={20} height={20} alt="Language logo" />
                                <span>{getLanguageByAbbr(b.language)}</span>
                            </div>
                        }></Tab>
                    ))
                }
            </Tabs>

            <CodeBlock code={group.blocks[selectedIndex].code} language={group.blocks[selectedIndex].language} html={group.blocks[selectedIndex].html} />
        </>
    )
}
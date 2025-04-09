"use client";

import { FileTree } from '@/components/code-editor/FileTree'
import { CodeEditor } from '@/components/code-editor/CodeEditor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React, { useMemo } from 'react'
import { buildFileTree } from '@/lib/FileManager';
import { useCodeEditor } from '@/context/CodeEditorContext';
import { EditorTabs } from './EditorTabs';
import TerminalWrapper from './terminal/TerminalWrapper';
import { ThemeToggle } from '../ThemeToggle';

export const EditorComponent: React.FC = ({
}) => {

    const { socket, files, setSelectedContextMenuFile } = useCodeEditor();

    const rootDir = useMemo(() => {
        const fileTree = buildFileTree(files);
        return fileTree;
    }, [files]);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground bg-[#17191E]">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={20} minSize={15} className='border-none dark:bg-[#17191E]' onClick={() => setSelectedContextMenuFile(undefined)}>
                    <FileTree rootDir={rootDir} />
                    <div className="absolute bottom-0 left-72 ml-4">
                    <ThemeToggle/>
                    </div>
                </ResizablePanel>
                <ResizableHandle className='shadow-md' />
                <ResizablePanel defaultSize={80}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <div className='bg-slate-100 dark:bg-[#17191E]'>
                                <EditorTabs />
                            </div>
                            <CodeEditor />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <TerminalWrapper socket={socket} />
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
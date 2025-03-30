import { useCodeEditor } from '@/context/CodeEditorContext';
import { getLanguageBasedOnExtension } from '@/lib/FileManager';
import { Editor } from '@monaco-editor/react'
import Image from 'next/image';
import logo from "../static/5.svg";
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const CodeEditor = () => {
    const { selectedFile, socket, updateOpenedFileProps } = useCodeEditor();
    const [language, setLanguage] = useState<string | undefined>(undefined);
    const theme = useTheme();

    useEffect(() => {
        if (selectedFile) {
            const extension = selectedFile?.name?.split('.').pop() || undefined;
            setLanguage(getLanguageBasedOnExtension(extension));
        }
    }, [selectedFile]);

    const debounce = (func: (value: string) => void, wait: number) => {
        let timeout: ReturnType<typeof setTimeout>;
        return (value: string) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(value);
            }, wait);
        };
    }

    return (
        selectedFile ?
            <Editor
                height="100%"
                defaultLanguage={language}
                value={selectedFile?.content}
                language={language}
                onChange={debounce((value) => {
                    if (value !== undefined) {
                        socket?.emit("updateContent", { path: selectedFile?.path, content: value });

                        if (selectedFile?.path) {
                            updateOpenedFileProps(selectedFile?.path, value);
                        }
                    }
                }, 500) as (value: string | undefined) => void}
                theme={theme.theme === 'dark' ? 'vs-dark' : 'vs-light'}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            /> :
            <div className="bg-[#2e2e2e] flex flex-col h-full w-full items-center shadow-lg between">
                <Image src={logo} width={350} height={350} alt="Logo" />
                <div className="text-center nunito">
                    <h1 className="text-white text-xl font-bold">Pathlyzer Code Editor: Fast. Robust. Portable.</h1>
                    <h3 className="text-white mt-3">You don&apos;t have any file selected. Use the file tree on the left to navigate through your project files.</h3>
                    <h3 className="text-white mt-3">You can also use our integrated bash console to run UNIX commands.</h3>
                </div>
            </div>
    )
}
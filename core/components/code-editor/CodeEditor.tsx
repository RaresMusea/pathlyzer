import { useCodeEditor } from '@/context/CodeEditorContext';
import { getLanguageBasedOnExtension } from '@/lib/FileManager';
import { Editor, Monaco } from '@monaco-editor/react'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { logoDetailedDark} from "@/exporters/LogoExporter";
import logoLight from '@/resources/logos/1.svg';
import { createHighlighter } from 'shiki';
import { shikiToMonaco } from '@shikijs/monaco';

export const CodeEditor = () => {
    const { selectedFile, socket, updateOpenedFileProps } = useCodeEditor();
    const [language, setLanguage] = useState<string | undefined>(undefined);
    const { theme } = useTheme();

    useEffect(() => {
        if (selectedFile) {
            const extension = selectedFile?.name?.split('.').pop() || undefined;
            setLanguage(getLanguageBasedOnExtension(extension));
        }
    }, [selectedFile]);

    const handleEditorDidMount = async (_: unknown, monacoInstance: Monaco) => {
        const highlighter = await createHighlighter({
          themes: ['github-dark-default', 'min-light'],
          langs: ["javascript", "typescript", "vue", "html", "css", "json", "java", "xml"],
        });
    
        monacoInstance.languages.register({ id: "javascript" });
        monacoInstance.languages.register({ id: "typescript" });
        monacoInstance.languages.register({ id: "vue" });
        monacoInstance.languages.register({ id: "html" });
        monacoInstance.languages.register({ id: "css" });
        monacoInstance.languages.register({ id: "json" });
        monacoInstance.languages.register({ id: "java" });
        monacoInstance.languages.register({ id: "xml" });
    
        await shikiToMonaco(highlighter, monacoInstance);
      };


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
                onMount={handleEditorDidMount}
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
                theme={ theme && (theme === 'dark' || theme === 'system')  ? 'github-dark-default' : 'min-light'}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            /> :
            <div className="dark:bg-[#21252b] bg-slate-50 dark:text-white text-black flex flex-col h-full w-full items-center shadow-lg between">
                <Image src={theme === 'dark' ? logoDetailedDark : logoLight} width={350} height={350} alt="Logo" />
                <div className="text-center font-nunito">
                    <h1 className=" text-xl font-bold">Pathlyzer Code Editor: Fast. Robust. Portable.</h1>
                    <h3 className="mt-3">You don&apos;t have any file selected. Use the file tree on the left to navigate through your project files.</h3>
                    <h3 className="mt-3">You can also use our integrated bash console to run UNIX commands.</h3>
                </div>
            </div>
    )
}
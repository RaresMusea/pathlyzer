"use client";

import { Check, Copy, Maximize, Minimize, Terminal, TerminalIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createHighlighter } from "shiki"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getIconForFile } from "vscode-icons-js";

const THEMES = {
    dark: [
        { id: "catppuccin-mocha", name: "Catppuccin Mocha" },
        { id: "github-dark", name: "GitHub Dark" },
        { id: "dracula", name: "Dracula" },
        { id: "nord", name: "Nord" },
        { id: "one-dark-pro", name: "One Dark Pro" },
        { id: "material-theme-palenight", name: "Material Palenight" },
        { id: "slack-dark", name: "Slack Dark" },
        { id: "solarized-dark", name: "Solarized Dark" },
        { id: "tokyo-night", name: "Tokyo Night" },
    ],
    light: [
        { id: "github-light", name: "GitHub Light" },
        { id: "light-plus", name: "Light+" },
        { id: "solarized-light", name: "Solarized Light" },
        { id: "min-light", name: "Min Light" },
        { id: "catppuccin-latte", name: "Catppuccin Latte" },
    ],
};

const LanguageNames: Record<string, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    tsx: "TypeScript React",
    jsx: "React",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    java: "Java",
    txt: "Plain Text",
    'c#': "C#",
    'c++': 'C++',
    c: 'c'
};

interface CodeBlockProps {
    code: string
    language: string
    html: string
};

export const CodeBlock = ({ code, language, html }: CodeBlockProps) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [currentTheme, setCurrentTheme] = useState<string>('catppuccin-mocha');
    const [highlightedHtml, setHighlightedHtml] = useState<string>(html);
    const codeBlockRef = useRef<HTMLDivElement>(null);
    const fullscreenOverlayRef = useRef<HTMLDivElement>(null);
    const codeContentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateHighlighting = async () => {
            try {
                const highlighter = await createHighlighter({
                    themes: [currentTheme],
                    langs: ["ts", "js", "html", "css", "json", "txt", "java", "tsx", "jsx"],
                })

                const newHtml = highlighter.codeToHtml(code, {
                    lang: language,
                    theme: currentTheme,
                })

                setHighlightedHtml(newHtml)
            } catch (error) {
                console.error("Error updating syntax highlighting:", error)
            }
        }

        updateHighlighting()
    }, [currentTheme, code, language]);


    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleFullscreen = () => {
        setIsAnimating(true)

        if (isFullscreen) {
            document.body.style.overflow = ""
            setTimeout(() => {
                setIsFullscreen(false)
                setIsAnimating(false)
            }, 300);
        } else {
            document.body.style.overflow = "hidden"
            setIsFullscreen(true)
            setTimeout(() => {
                setIsAnimating(false)
            }, 300);
        }
    }

    const getLanguageIcon = (): string | undefined => {
        console.log(`Document.${language.toLowerCase()}`)
        const icon = getIconForFile(`Document.${language.toLowerCase()}`);
        return `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${icon}`;
    }

    const lineCount: number = code.split("\n").length;
    const languageName: string = LanguageNames[language] || language.toUpperCase();
    const languageIcon: string | JSX.Element = getLanguageIcon() || <Terminal className="h-4 w-4" />;

    const handleThemeChange = (value: string): void => {
        setCurrentTheme(value)
    }

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isFullscreen && !isAnimating) {
                toggleFullscreen()
            }
        }

        window.addEventListener("keydown", handleEscKey)
        return () => {
            window.removeEventListener("keydown", handleEscKey)
        }
    }, [isFullscreen, toggleFullscreen, isAnimating]);

    useEffect(() => {
        const handleScroll = () => {
            if (codeContentRef.current) {
                const { scrollLeft } = codeContentRef.current
                const lineNumbers = codeContentRef.current.previousElementSibling
                if (lineNumbers && lineNumbers.classList.contains("line-numbers")) {
                    // Apply a transform to keep line numbers visible during horizontal scroll
                    ; (lineNumbers as HTMLElement).style.transform = `translateX(${scrollLeft}px)`
                }
            }
        }

        const codeContent = codeContentRef.current
        if (codeContent) {
            codeContent.addEventListener("scroll", handleScroll)
            return () => {
                codeContent.removeEventListener("scroll", handleScroll)
            }
        }
    }, []);

    //bg-gradient-to-br from-zinc-950 to-zinc-900
    const darkModeClasses: string = "font-nunito dark:border-[#2e2e2e] dark:bg-background dark:text-zinc-200 border-zinc-200 bg-white text-zinc-800";

    const darkModeHeaderClasses: string = "dark:border-zinc-800 dark:bg-background dark:text-white border-[#c7c7c7] bg-zinc-50/80 text-zinc-800";

    const darkModeFooterClasses: string = "dark:border-[#2e2e2e] dark:bg-background dark:text-white border-zinc-200 bg-zinc-50/50 text-zinc-500";

    const darkModeLineNumbersClasses: string = "dark:border-zinc-800 dark:bg-background text-white border-zinc-200 bg-zinc-50/50 text-zinc-400";

    const darkModeOverlayClasses: string = "bg-transparent backdrop-blur";

    return (
        <>
            <div
                ref={codeBlockRef}
                className={`relative overflow-hidden mt-3 mb-3 rounded-xl border shadow-md transition-all duration-300 ${darkModeClasses}`}
            >
                {/* Blue top accent bar */}
                <div className="h-1 w-full bg-[var(--pathlyzer-table-border)]"></div>

                {/* Header */}
                <div
                    className={`flex flex-wrap items-center justify-between border-b px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm ${darkModeHeaderClasses}`}
                >
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        {typeof languageIcon === 'string' ? <Image src={languageIcon} width={30} height={30} alt="Logo Image" /> : <TerminalIcon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{languageName}</span>
                        <span
                            className={`ml-2 rounded-full bg-background px-2 py-0.5 text-xs dark:text-zinc-400 text-zinc-600`}
                        >
                            {lineCount} lines
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFullscreen}
                            className={`h-7 w-7 md:h-8 md:w-8 dark:text-zinc-400 dark:hover:text-zinc-200 text-zinc-600 hover:text-zinc-900`}
                            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                            disabled={isAnimating}
                        >
                            {isFullscreen ? (
                                <Minimize className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            ) : (
                                <Maximize className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            )}
                        </Button>
                        <Button
                            size="sm"
                            onClick={copyToClipboard}
                            className={`h-7 md:h-8 gap-1 px-2 text-xs ${copied
                                ? `bg-green-500/20 dark:text-green-400 text-green-700 hover:bg-green-500/30`
                                : ""
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    <span className="hidden sm:inline">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    <span className="hidden sm:inline">Copy code</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Code content */}
                <div className="group relative">
                    <div ref={codeContentRef} className="flex max-h-[60vh] md:max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                        {/* Line numbers */}
                        <div
                            className={`line-numbers flex flex-col items-end border-r px-2 pt-4 text-xs md:text-sm lg:text-medium shrink-0 ${darkModeLineNumbersClasses}`}
                        >
                            {Array.from({ length: lineCount }).map((_, i) => (
                                <div key={i} className="leading-5 md:leading-6">
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Code with syntax highlighting - reduced left padding */}
                        <div
                            className="pt-4 pl-4 pr-4 w-full overflow-x-auto overflow-y-hidden scrollbar-thin h-full"
                        >
                            <div
                                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                className="min-w-fit text-xs md:text-sm lg:text-medium leading-5 whitespace-pre"
                            />
                        </div>
                    </div>

                    {/* Fancy bottom gradient */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t dark:from-zinc-950 from-white to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                    ></div>
                </div>

                {/* Footer with theme selector */}
                <div className={`border-t px-3 py-2 md:px-4 md:py-2 text-xs ${darkModeFooterClasses}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center justify-start">
                            <span>Powered by Pathlyzer SenseLayer</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline">Theme:</span>
                            <Select value={currentTheme} onValueChange={handleThemeChange}>
                                <SelectTrigger
                                    className={`h-7 w-[140px] sm:w-[180px] dark:border-zinc-700 bg-background dark:bg-background dark:text-zinc-300 border-zinc-300 bg-back text-zinc-700 text-xs`}
                                >
                                    <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="header-dark" disabled className="text-xs font-semibold">
                                        Dark Themes
                                    </SelectItem>
                                    {THEMES.dark.map((theme) => (
                                        <SelectItem key={theme.id} value={theme.id} className="text-xs">
                                            {theme.name}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="header-light" disabled className="text-xs font-semibold">
                                        Light Themes
                                    </SelectItem>
                                    {THEMES.light.map((theme) => (
                                        <SelectItem key={theme.id} value={theme.id} className="text-xs">
                                            {theme.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated fullscreen overlay */}
            <div
                ref={fullscreenOverlayRef}
                className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${darkModeOverlayClasses} ${isFullscreen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={(e) => {
                    // Close fullscreen when clicking outside the code block
                    if (e.target === fullscreenOverlayRef.current && !isAnimating) {
                        toggleFullscreen()
                    }
                }}
            >
                <div
                    className={`relative max-h-[95vh] w-[95vw] overflow-hidden rounded-xl border shadow-lg transition-all duration-300 ${darkModeClasses} ${isAnimating && isFullscreen
                        ? "scale-100 opacity-100"
                        : isAnimating
                            ? "scale-95 opacity-0"
                            : "scale-100 opacity-100"
                        }`}
                >
                    {/* Blue top accent bar */}
                    <div className="h-1 w-full bg-[var(--pathlyzer)]"></div>

                    {/* Header */}
                    <div
                        className={`flex flex-wrap items-center justify-between border-b px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm ${darkModeHeaderClasses}`}
                    >
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                            {typeof languageIcon === 'string' ? <Image src={languageIcon} width={30} height={30} alt="Logo Image" /> : <TerminalIcon className="h-4 w-4" />}
                            <span className="text-sm font-medium">{languageName}</span>
                            <span
                                className={`ml-2 rounded-full bg-background px-2 py-0.5 text-xs dark:text-zinc-400 text-zinc-600`}
                            >
                                {lineCount} lines
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleFullscreen}
                                className={`h-7 w-7 md:h-8 md:w-8 dark:text-zinc-400 dark:hover:text-zinc-200 text-zinc-600 hover:text-zinc-900`}
                                title="Exit fullscreen"
                                disabled={isAnimating}
                            >
                                <Minimize className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={copyToClipboard}
                                className={`h-7 md:h-8 gap-1 px-2 text-xs ${copied
                                    ? `bg-green-500/20 dark:text-green-400 text-green-700 hover:bg-green-500/30`
                                    : ""
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                        <span className="hidden sm:inline">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                        <span className="hidden sm:inline">Copy code</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Code content */}
                    <div className="group relative max-h-[calc(95vh-8rem)]">
                        {/* Line numbers */}
                        <div
                            className={`line-numbers absolute left-0 top-0 flex flex-col items-end border-r px-2 py-4 text-xs ${darkModeLineNumbersClasses}`}
                        >
                            {Array.from({ length: lineCount }).map((_, i) => (
                                <div key={i} className="leading-5">
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Code with syntax highlighting - reduced left padding */}
                        <div className="overflow-auto py-4 pl-8 pr-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                            <div
                                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                className="font-mono text-sm md:text-medium lg:text-large lg leading-5"
                            />
                        </div>
                    </div>

                    {/* Footer with theme selector */}
                    <div className={`border-t px-3 py-2 md:px-4 md:py-2 text-xs ${darkModeFooterClasses}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span>
                                Powered by Pathlyzer SenseLayer
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline">Theme:</span>
                                <Select value={currentTheme} onValueChange={handleThemeChange}>
                                    <SelectTrigger
                                        className={`h-7 w-[140px] sm:w-[180px] dark:border-zinc-700 bg-background dark:text-zinc-300 border-zinc-300 text-zinc-700 text-xs`}
                                    >
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="header-dark" disabled className="text-xs font-semibold">
                                            Dark Themes
                                        </SelectItem>
                                        {THEMES.dark.map((theme) => (
                                            <SelectItem key={theme.id} value={theme.id} className="text-xs">
                                                {theme.name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="header-light" disabled className="text-xs font-semibold">
                                            Light Themes
                                        </SelectItem>
                                        {THEMES.light.map((theme) => (
                                            <SelectItem key={theme.id} value={theme.id} className="text-xs">
                                                {theme.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


"use client";

import { RefObject, useRef } from "react";
import Image from "next/image";
import { Check, Copy, Minimize, TerminalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CodeLightboxProps = {
    copyToClipboard: () => Promise<void>;
    toggleFullscreen: () => void;
    handleThemeChange: (newTheme: string) => void;
    isFullscreen: boolean;
    isAnimating: boolean;
    copied: boolean;
    darkModeOverlayClasses: string;
    darkModeClasses: string;
    darkModeHeaderClasses: string;
    darkModeLineNumbersClasses: string;
    darkModeFooterClasses: string;
    languageIcon: string | JSX.Element;
    languageName: string;
    lineCount: number;
    codeContentRef: RefObject<HTMLDivElement>;
    highlightedHtml: string;
    currentTheme: string;
    THEMES: {
        dark: {
            id: string;
            name: string;
        }[];
        light: {
            id: string;
            name: string;
        }[];
    };
}

export const CodeLightbox = (props: CodeLightboxProps) => {
    const fullscreenOverlayRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div
                ref={fullscreenOverlayRef}
                className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${props.darkModeOverlayClasses} ${props.isFullscreen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={(e) => {
                    if (e.target === fullscreenOverlayRef.current && !props.isAnimating) {
                        props.toggleFullscreen()
                    }
                }}
            >
                <div
                    className={`relative max-h-[95vh] w-[95vw] overflow-hidden rounded-xl border shadow-lg transition-all duration-300 ${props.darkModeClasses} ${props.isAnimating && props.isFullscreen
                        ? "scale-100 opacity-100"
                        : props.isAnimating
                            ? "scale-95 opacity-0"
                            : "scale-100 opacity-100"
                        }`}
                >
                    {/* Blue top accent bar */}
                    <div className="h-1 w-full bg-[var(--pathlyzer-table-border)]"></div>

                    {/* Header */}
                    <div
                        className={`flex flex-wrap items-center justify-between border-b px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm ${props.darkModeHeaderClasses}`}
                    >
                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                            {typeof props.languageIcon === 'string' ? <Image src={props.languageIcon} width={30} height={30} alt="Logo Image" /> : <TerminalIcon className="h-4 w-4" />}
                            <span className="text-sm font-medium">{props.languageName}</span>
                            <span
                                className={`ml-2 rounded-full bg-background px-2 py-0.5 text-xs dark:text-zinc-400 text-zinc-600`}
                            >
                                {props.lineCount} lines
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={props.toggleFullscreen}
                                className={`h-7 w-7 md:h-8 md:w-8 dark:text-zinc-400 dark:hover:text-zinc-200 text-zinc-600 hover:text-zinc-900`}
                                title="Exit fullscreen"
                                disabled={props.isAnimating}
                            >
                                <Minimize className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={props.copyToClipboard}
                                className={`h-7 md:h-8 gap-1 px-2 text-xs ${props.copied
                                    ? `bg-green-500/20 dark:text-green-400 text-green-700 hover:bg-green-500/30`
                                    : ""
                                    }`}
                            >
                                {props.copied ? (
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
                    <div className="group-relative">
                        <div ref={props.codeContentRef} className="flex max-h-[60vh] md:max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                            {/* Line numbers */}
                            <div
                                className={`line-numbers flex flex-col items-end border-r px-2 pt-4 text-xs md:text-sm lg:text-medium shrink-0 ${props.darkModeLineNumbersClasses}`}
                            >
                                {Array.from({ length: props.lineCount }).map((_, i) => (
                                    <div key={i} className="leading-5 md:leading-6">
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Code with syntax highlighting - reduced left padding */}
                            <div className="pt-4 pl-4 pr-4 w-full overflow-x-auto overflow-y-hidden scrollbar-thin h-full">
                                <div
                                    dangerouslySetInnerHTML={{ __html: props.highlightedHtml }}
                                    className="min-w-fit text-xs md:text-sm lg:text-medium leading-5 whitespace-pre"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer with theme selector */}
                    <div className={`border-t px-3 py-2 md:px-4 md:py-2 text-xs ${props.darkModeFooterClasses}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span>
                                Powered by Pathlyzer SenseLayer
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline">Theme:</span>
                                <Select value={props.currentTheme} onValueChange={props.handleThemeChange}>
                                    <SelectTrigger
                                        className={`h-7 w-[140px] sm:w-[180px] dark:border-zinc-700 bg-background dark:text-zinc-300 border-zinc-300 text-zinc-700 text-xs`}
                                    >
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="header-dark" disabled className="text-xs font-semibold">
                                            Dark Themes
                                        </SelectItem>
                                        {props.THEMES.dark.map((theme) => (
                                            <SelectItem key={theme.id} value={theme.id} className="text-xs">
                                                {theme.name}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="header-light" disabled className="text-xs font-semibold">
                                            Light Themes
                                        </SelectItem>
                                        {props.THEMES.light.map((theme) => (
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
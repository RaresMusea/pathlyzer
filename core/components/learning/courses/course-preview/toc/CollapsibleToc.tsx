"use client";

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TableOfContents } from "./TableOfContents"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/useMediaQuery"

type CollapsibleTocProps = {
    content: JSX.Element | null;
}

export const CollapsibleToc = (props: CollapsibleTocProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [hasHeadings, setHasHeadings] = useState<boolean>(true);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsCollapsed(isMobile);
    }, [isMobile]);

    if (!hasHeadings) {
        console.warn("No headings");
        return null;
    }

    if (isMobile) {
        return (
            <>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-40"
                            aria-label="Open table of contents"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[80%] max-w-xs p-0 overflow-x-hidden">
                        <div className="flex h-14 items-center justify-between border-b px-4">
                            <h2 className="text-xl font-bold">Summary</h2>
                        </div>
                        <ScrollArea className="h-[calc(100vh-3.5rem)] p-4 overflow-x-hidden">
                            <TableOfContents content={props.content} onHeadingsChange={setHasHeadings} />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </>
        )
    }

    return (
        <div
            className={cn(
                "h-screen sticky top-0 left-0 border-r bg-background transition-all duration-300 ease-in-out",
                isCollapsed ? "w-12 flex-shrink-0" : "w-64 lg:w-72",
            )}
        >
            <div className="flex h-14 items-center justify-between border-b px-4">
                <h2
                    className={cn(
                        "text-xl font-bold transition-opacity duration-200",
                        isCollapsed ? "opacity-0 invisible" : "opacity-100 visible",
                    )}
                >
                    Summary
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("transition-all duration-300", isCollapsed ? "absolute right-0 z-10" : "ml-auto")}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Extinde cuprinsul" : "Restrânge cuprinsul"}
                >
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>

            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "opacity-0 invisible" : "opacity-100 visible",
                )}
            >
                <ScrollArea className="h-[calc(100vh-3.5rem)] p-4">
                    <TableOfContents content={props.content} onHeadingsChange={setHasHeadings} />
                </ScrollArea>
            </div>

            {isCollapsed && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-20 w-12 h-12 flex items-center justify-center"
                    onClick={() => setIsCollapsed(false)}
                    aria-label="Extinde cuprinsul"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}

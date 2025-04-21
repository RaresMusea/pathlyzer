"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TableOfContenstsSection {
    id: string;
    text: string;
    level: number;
};

type TableOfContentsProps = {
    onHeadingsChange?: (hasHeadings: boolean) => void;
    content: JSX.Element | null;
}

type ScrollParams = {
    scrollPosition: number,
    windowHeight: number,
    documentHeight: number;
    scrollPercentage: number;
};

const generateHeadingId = (headingElem: Element): string => {
    if (!headingElem.id) {
        headingElem.id = headingElem.textContent?.toLowerCase().replace(/[^\w]+/g, "-") || '';
    }

    return headingElem.id;
}

const getCurrentScrollParams = (): ScrollParams => {
    const scrollPosition: number = window.scrollY;
    const windowHeight: number = window.innerHeight;
    const documentHeight: number = document.documentElement.scrollHeight;
    const scrollPercentage: number = scrollPosition / (documentHeight - windowHeight);

    return {
        scrollPosition,
        windowHeight,
        documentHeight,
        scrollPercentage
    };
}

export const TableOfContents = (props: TableOfContentsProps) => {
    const [headings, setHeadings] = useState<TableOfContenstsSection[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const userClickedRef = useRef<{ id: string; timestamp: number } | null>(null);

    useEffect(() => {
        if (!props.content) return;
        
        //@TODO: To be extended once adding more headings to the course editor
        console.log("PROSE", document.querySelector('.prose'));
        const elements = Array.from(document.querySelector(".prose")?.querySelectorAll("h1, h2, h3") || []);

        console.log("Headings", elements);

        const headingElements = elements.map((element) => {
            const id: string = generateHeadingId(element);

            return {
                id,
                text: element.textContent || "",
                level: Number.parseInt(element.tagName[1]),
            }
        })

        setHeadings(headingElements);

        if (props.onHeadingsChange) {
            props.onHeadingsChange(headingElements.length > 0);
        }

        const findActiveHeading = () => {
            if (userClickedRef.current) {
                const { id, timestamp } = userClickedRef.current;
                const now = Date.now();

                if (now - timestamp < 1500) {
                    setActiveId(id);
                    return;
                } else {
                    userClickedRef.current = null;
                }
            }

            const scrollParameters: ScrollParams = getCurrentScrollParams();

            const headingPositions = elements.map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                    id: element.id,
                    top: rect.top + window.scrollY,
                    element,
                };
            })

            headingPositions.sort((a, b) => a.top - b.top);
            let activeHeading = null;

            if (scrollParameters.scrollPercentage < 0.85) {
                for (let i = 0; i < headingPositions.length; i++) {
                    const current = headingPositions[i];
                    const next = headingPositions[i + 1];

                    if (current.top <= scrollParameters.scrollPosition + 100 && (!next || next.top > scrollParameters.scrollPosition + 100)) {
                        activeHeading = current;
                        break;
                    }
                }

                if (!activeHeading && headingPositions.length > 0) {
                    activeHeading = headingPositions[0];
                }
            } else {
                const remainingPercentage = (scrollParameters.scrollPercentage - 0.85) / 0.15;

                const endHeadings = headingPositions.filter(
                    (h) => h.top >= scrollParameters.documentHeight * 0.7,
                );

                if (endHeadings.length > 0) {
                    const activeIndex = Math.min(Math.floor(remainingPercentage * endHeadings.length), endHeadings.length - 1);
                    activeHeading = endHeadings[activeIndex];
                }
            }

            if (activeHeading) {
                setActiveId(activeHeading.id);
            }
        }

        const observer = new IntersectionObserver(
            () => {
                findActiveHeading()
            },
            {
                rootMargin: "0px",
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        )

        elements.forEach((element) => observer.observe(element));

        window.addEventListener("scroll", findActiveHeading, { passive: true });
        findActiveHeading();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", findActiveHeading);
        }
    }, [props.onHeadingsChange, props.content]);

    const smoothScrollToElement = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        setActiveId(elementId)

        userClickedRef.current = {
            id: elementId,
            timestamp: Date.now(),
        }

        const headerOffset = 20;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="toc">
            <ul className="space-y-1">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={cn(
                            "transition-colors",
                            heading.level === 1 && "mt-2",
                            heading.level > 1 && `ml-${(heading.level - 1) * 4}`,
                        )}
                    >
                        <button
                            className={cn(
                                "block py-1 text-sm text-left w-full hover:text-primary transition-colors",
                                activeId === heading.id ? "font-medium text-primary" : "text-muted-foreground",
                            )}
                            onClick={() => smoothScrollToElement(heading.id)}
                        >
                            {heading.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )

}
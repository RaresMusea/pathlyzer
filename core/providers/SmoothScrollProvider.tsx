"use client";

import type React from "react";
import { useEffect } from "react";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== "undefined" && !("scrollBehavior" in document.documentElement.style)) {
            const originalScrollTo = window.scrollTo;

            window.scrollTo = function () {
                if (arguments[0] && typeof arguments[0] === "object" && arguments[0].behavior === "smooth") {
                    const { top, left } = arguments[0];

                    smoothScrollTo(left || window.scrollX, top || window.scrollY);
                } else {
                    originalScrollTo.apply(this, arguments as any);
                }
            }
        }

        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a[href^="#"]');

            if (anchor) {
                const targetId = anchor.getAttribute("href")?.substring(1);

                if (targetId) {
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                        });
                    }
                }
            }
        }

        document.addEventListener("click", handleAnchorClick);

        return () => {
            document.removeEventListener("click", handleAnchorClick);
        }
    }, [])

    return <>{children}</>
}

function smoothScrollTo(x: number, y: number) {
    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;
    const distanceX = x - startX;
    const distanceY = y - startY;
    const durationMs = 300;

    let startTime: number | null = null;

    function step(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        const easeInOutCubic = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(startX + distanceX * easeInOutCubic, startY + distanceY * easeInOutCubic);

        if (elapsed < durationMs) {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}
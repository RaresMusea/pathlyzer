"use client";

import { ShieldAlert } from "lucide-react";
import { useState } from "react";

export const AnimatedShield = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <div className="mb-4 flex justify-center relative">
            <div
                className={`absolute inset-0 bg-white rounded-full opacity-50 ${isHovered ? "animate-pulse-shield" : "animate-pulse"}`}
                style={{ width: "64px", height: "64px", margin: "auto" }}
            />
            <ShieldAlert
                className={`h-16 w-16 text-red-500 relative z-10 transition-transform duration-300 ${isHovered ? "animate-bounce-shield scale-110" : "animate-pulse-shield"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
        </div>
    )
}
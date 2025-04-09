"use client";

import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

interface HeaderProps {
    headerTitle: string;
};

export const Header = ({ headerTitle }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col flex-gap gap-y-4 items-center justify-center">
            <h1 className={cn("text-center font-semibold text-3xl drop-shadow-md", font.className)}>Authenticator</h1>
            <p className="text-muted-foreground text-small">{headerTitle}</p>
        </div>
    )
}
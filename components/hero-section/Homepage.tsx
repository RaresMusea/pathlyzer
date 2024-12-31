"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { navLogoDark, navLogoLight } from "@/exporters/LogoExporter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Pathgrid } from "@/components/hero-section/Pathgrid";

export const Homepage = () => {
    const theme = useTheme();
    console.log(theme?.theme);

    return (
        <main>
            <Pathgrid />
        </main>
    )
};
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { navLogoDark, navLogoLight } from "@/exporters/LogoExporter";
import { ThemeToggle } from "../ThemeToggle";

export const Homepage = () => {
    const theme = useTheme();

    return (
        <main>
            <section className="mx-3 flex items-center justify-between gap-x-5">
                <Image src={theme?.theme === "light" ? navLogoLight : navLogoDark} width={150} height={150} alt="Nav Logo" />
                <ThemeToggle />
            </section>
        </main>
    )
};
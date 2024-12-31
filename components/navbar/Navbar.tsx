"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { navLogoLight, navLogoDark } from "@/exporters/LogoExporter";
import { ThemeToggle } from "../ThemeToggle";


export const Navbar = () => {
    const theme = useTheme();
    return (
        <main className="mx-4 flex items-center justify-between gap-x-5 sticky">
            <Image src={theme?.theme === "light" ? navLogoLight : navLogoDark} width={120} height={120} alt="Logo" />
            <ThemeToggle />
        </main>
    );
};

"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { navLogoLight, navLogoDark } from "@/exporters/LogoExporter";
import { ThemeToggle } from "../ThemeToggle";
import { usePathname } from "next/navigation";


export const Navbar = () => {
    const theme = useTheme();
    const pathname = usePathname();
    return (
        <>
            {!pathname.includes('code') ?
                <nav className="mx-4 flex items-center justify-between sticky" >
                    <Image src={theme?.theme === "light" ? navLogoLight : navLogoDark} width={100} height={120} alt="Logo" />
                    <ThemeToggle />
                </nav>
                : 
                null
            }
        </>
    );
};

"use client";

import { logoDetailedDark, logoDetailedLight } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import Image from "next/image";

export const AuthImageLogo = () => {
    const theme = useTheme();
    console.log("IMAGE LOGO", theme);

    return (
        <div className="relative hidden bg-muted md:block">
            <Image
                src={theme?.theme === 'dark' ? logoDetailedDark : logoDetailedLight}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
            />
        </div>
    );
};
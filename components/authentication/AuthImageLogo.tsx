"use client";

import { logoDetailedDark, logoDetailedLight } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import Image from "next/image";

export const AuthImageLogo = () => {
    const theme = useTheme();

    return (
        <div className="relative hidden bg-muted md:block xl:block">
            <Image
                src={theme?.theme === 'dark' ? logoDetailedDark : logoDetailedLight}
                alt="Image"
                width={20}
                height={20}
                className="absolute inset-0 h-full w-full"
            />
        </div>
    );
};
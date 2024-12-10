"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
    backButtonText: string;
    backButtonHref: string;
}

export const BackButton = ({
    backButtonText,
    backButtonHref }: BackButtonProps) => {

    return (
        <Button variant="link" className="font-normal w-full flex items-start" size="sm" asChild>
            <Link href={backButtonHref}>
                {backButtonText}
            </Link>
        </Button>
    );
}
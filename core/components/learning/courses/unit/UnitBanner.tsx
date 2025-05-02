"use client";

import { Button } from "@/components/ui/button";
import { NotebookText } from "lucide-react";
import Link from "next/link";

export const UnitBanner = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="container mx-auto w-[80%]">
            <div className="w-full rounded-xl dark:bg-muted/50 bg-muted/75 p-5 text-black dark:text-white flex items-center justify-between">
                <div className="space-y-2.5">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-md">{description}</p>
                </div>
                <Link href="#">
                    <Button className="transition-colors bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] text-white">
                        <NotebookText className="mr-2" />
                        Continue
                    </Button>
                </Link>
            </div>
        </div>
    )
}
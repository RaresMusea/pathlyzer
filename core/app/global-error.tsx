'use client';

import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [isAnimated, setIsAnimated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsAnimated(true)
    }, []);

    return (
        <section>
            <Navbar />
            <div className="flex flex-col items-center m-0 p-0 justify-center h-full text-center font-nunito">
                <div className={`p-3 bg-red-100 rounded-full transition-all duration-700 ${isAnimated ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}>
                    <AlertCircle className={`h-12 w-12 text-red-600 ${isAnimated ? 'animate-bounce' : ''}`} />
                </div>
                <h2 className="text-2xl font-bold mb-2">{"An unexpected error occurred"}... We are sorry for the inconvenience. Trying our best to fix this issue as soon as possible.</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                </p>
                <Button
                    className="button px-4 py-2 bg-[var(--pathlyzer-table-border)] text-white rounded-lg hover:bg-[var(--pathlyzer)] transition-colors hover:text-white"
                    onClick={router.refresh}
                >
                    Try Again
                </Button>
            </div>
        </section>
    )
}
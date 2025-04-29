"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ErrorPageWrapper = ({
    error,
    reset,
    detailedMessage
}: {
    error: Error & { digest?: string }
    reset: () => void;
    detailedMessage: string;
}) => {
    const router = useRouter();
    const isFriendlyMessage = error.message.length < 200;
    const [isAnimated, setIsAnimated] = useState<boolean>(false);

    useEffect(() => {
        setIsAnimated(true)
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className={`p-3 bg-red-100 rounded-full transition-all duration-700 ${isAnimated ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}>
                <AlertCircle className={`h-12 w-12 text-red-600 ${isAnimated ? 'animate-bounce' : ''}`} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{isFriendlyMessage ? error.message : "An unexpected error occurred"}... We are sorry for the inconvenience. Trying our best to fix this issue as soon as possible.</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                More details: {detailedMessage}
            </p>
            <Button
                className="button px-4 py-2 bg-[var(--pathlyzer-table-border)] text-white rounded-lg hover:bg-[var(--pathlyzer)] transition-colors hover:text-white"
                onClick={() => {
                    try {
                        reset();
                    } catch (error) {
                        router.refresh();
                    }
                }}
            >
                Try Again
            </Button>
            <Button variant="secondary" className="mt-2 transition-color" onClick={() => router.push('/admin/insights')}>
                Back to Inshights page
            </Button>
        </div>
    )
}
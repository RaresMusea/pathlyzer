"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ErrorPage() {
    const [isAnimated, setIsAnimated] = useState<boolean>(false);

    useEffect(() => {
        setIsAnimated(true)
    }, []);

    return (
        <div className="inset-0 h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/70 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-lg border border-border">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 bg-red-100 rounded-full transition-all duration-700 ${isAnimated ? "scale-100 opacity-100" : "scale-50 opacity-0"
                        }`}>
                        <AlertCircle className={`h-12 w-12 text-red-600 ${isAnimated ? 'animate-bounce' : ''}`} />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight">Unable to fetch projects data</h1>

                    <p className="text-muted-foreground">
                        We couldn&apos;t load your projects. This might be due to a network issue or a temporary server problem.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>

                        <Button asChild>
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
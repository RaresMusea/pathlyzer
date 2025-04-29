"use client";

import { ErrorPageWrapper } from "@/components/misc/errors/ErrorPageWrapper";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void;
}) {
    return (
        <ErrorPageWrapper error={error} reset={reset} detailedMessage="An internal server error blocked your update."/>
    )
}

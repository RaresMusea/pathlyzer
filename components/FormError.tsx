"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
    message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null;

    return (
        <section className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-small text-destructive-500">
            <ExclamationTriangleIcon className="h-4 w-4 " />
            <p>{message}</p>
        </section>
    );
};
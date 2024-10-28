"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface FormErrorProps {
    message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        if (message) {
            setVisible(true);
        }
    }, [message]);

    if (!message || !visible) return null;
    
    return (
        <section className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-small text-destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
            <button
                onClick={() => setVisible(!visible)}
                className="ml-auto text-destructive-500 hover:text-destructive-700"
            >
                &times;
            </button>
        </section>
    );
};
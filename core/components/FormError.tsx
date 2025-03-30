"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { InviewType, InViewWrapper } from "./hero-section/InView";

interface FormErrorProps {
    message?: string;
    hasCloseButton?: boolean;
}

export const FormError = ({ message, hasCloseButton = true }: FormErrorProps) => {
    const [visible, setVisible] = useState<boolean>(true);

    useEffect(() => {
        if (message) {
            setVisible(true);
        }
    }, [message]);

    if (!message || !visible) return null;

    return (
        <InViewWrapper type={InviewType.NORMAL}>
        <section className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-small text-destructive">
            <ExclamationTriangleIcon className="h-15 w-15" />
            <p>{message}</p>
            { hasCloseButton && (
                <button
                    onClick={() => setVisible(!visible)}
                    className="ml-auto text-destructive-500 hover:text-destructive-700"
                >
                    &times;
                </button>
            )}
        </section>
        </InViewWrapper>
    );
};
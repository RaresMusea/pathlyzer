import { CheckCircledIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react";

interface FormSuccessProps {
    message?: string;
    hasCloseButton?: boolean;
};

export const FormSuccess = ({ message, hasCloseButton = true }: FormSuccessProps) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
        }
    }, [message]);

    if (!message || !visible) return null;

    return (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-small text-emerald-500">
            <CheckCircledIcon className="h-15 w-15" />
            <p>{message}</p>
            { hasCloseButton && (
            <button
                onClick={() => setVisible(!visible)}
                className="ml-auto text-destructive-500 hover:text-destructive-700"
            >
                &times;
            </button>
            )}
        </div>
    );
}
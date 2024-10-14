"use client";

import { useRouter } from "next/navigation";

interface SignUpButtonProps {
    children: React.ReactNode;
    mode: "redirect" | "modal";
    asChild?: boolean;
};

export const SignUpButton = ({ children, mode = "redirect", asChild }: SignUpButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/login")
    };

    if (mode === "modal") {
        return (
            <span>To be replaced with a modal in the future</span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
}
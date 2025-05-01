"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";

export const SocialAuthMethods = ({ setError }: { setError: (errorMessage: string) => void }) => {

    const onClick = async (provider: "google" | "github") => {
        try {
            await signIn(provider, {
                redirectTo: DEFAULT_LOGIN_REDIRECT
            });
        } catch (error) {
            console.error(error);
            setError(error?.message);
        }
    };

    return (
        <div className="w-full flex gap-x-2">
            <Button variant="secondary" size="lg" className="w-full" onClick={() => onClick("google")}>
                <FcGoogle className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => onClick("github")}>
                <FaGithub className="h-4 w-4" />
            </Button>
        </div>
    )
}
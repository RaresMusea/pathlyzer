"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";


export const SocialAuthMethods = () => {
    return (
        <div className="w-full flex gap-x-2">
            <Button variant="secondary" size="lg" className="w-full" onClick={() => {}}>
                <FcGoogle className="h-4 w-4"/>
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={() => {}}>
                <FaGithub className="h-4 w-4"/>
            </Button>
        </div>
    )
}
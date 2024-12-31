"use client";

import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Navbar } from "../_components/Navbar";

const SettingsPage = () => {
    const currentUser = useCurrentUser();

    const onClick = () => {
        signOut();
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <Navbar /> 
        </div>
    )
}

export default SettingsPage;
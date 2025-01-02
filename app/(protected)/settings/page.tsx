 "use client";

import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
    const currentUser = useCurrentUser();

    const onClick = () => {
        signOut();
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <Button onClick={() => onClick()}>Sign Out</Button>
        </div>
    )
};

export default SettingsPage;
 "use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
    //const currentUser = useCurrentUser();
    const router = useRouter();

    const deauth = () => {
        signOut();
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <Button onClick={() => deauth()}>Sign Out</Button>
            <Button variant="outline" onClick={() => router.push('/projects')}>View my projects</Button>
        </div>
    )
};

export default SettingsPage;
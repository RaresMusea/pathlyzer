"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
    //const currentUser = useCurrentUser();
    const router = useRouter();
    const session = useSession();

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <p>Session expires at: {session.data?.expires}</p>
            <p>User details: {session.data?.user.email}, {session.data?.user.name}, {session.data?.user.username}</p>
            <Button variant="outline" onClick={() => router.push('/projects')}>View my projects</Button>
            <Button variant="outline" onClick={() => router.push('/learning/courses/create')}>Go to Course Creation</Button>
        </div>
    )
};

export default SettingsPage;
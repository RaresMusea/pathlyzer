import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
    const session = await auth();
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <div>{JSON.stringify(session)}</div>
            <form action={async () => {
                "use server";
                await signOut({ redirectTo: '/login', redirect: true });
            }} >
                <Button type="submit">
                    Sign out
                </Button>
            </form>
        </div>
    )
}

export default SettingsPage;
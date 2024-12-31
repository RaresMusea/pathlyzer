import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return (
        <SessionProvider session={session}>
        <div className="h-full w-full flex flex-col items-center justify-center">
            {children}
        </div>
        </SessionProvider>
    );
}

export default ProtectedLayout;
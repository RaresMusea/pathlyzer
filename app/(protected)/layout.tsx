import { auth } from "@/auth";
import { AuthImageLogo } from "@/components/authentication/AuthImageLogo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}

export default ProtectedLayout;
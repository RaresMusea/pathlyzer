import { auth } from "@/auth";
import { Navbar } from "@/components/navbar/Navbar";
import { SessionProvider } from "next-auth/react";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = await auth();

    return (
        <>
            <SessionProvider session={session}>
                <main>
                    <Navbar />
                    {children}
                </main>
            </SessionProvider>
        </>
    );
}
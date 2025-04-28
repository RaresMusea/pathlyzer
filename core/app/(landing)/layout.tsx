import { Navbar } from "@/components/navbar/Navbar";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <>
            <main>
                <Navbar />
                {children}
            </main>

        </>
    );
}
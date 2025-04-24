import { Navbar } from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/provider/ThemeProvider";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Navbar />
                {children}
            </ThemeProvider>
        </main>
    );
}
import { mapRecentProjectsToNavItems } from "@/lib/NavigationUtils";
import { auth } from "@/auth";
import { BreadcrumbsGenerator } from "@/components/navigation/BreadcrumbsGenerator";
import { NavSidebar } from "@/components/navigation/NavSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const recentProjects = await mapRecentProjectsToNavItems(`code/${session?.user.id}/`, session?.user.id || '');

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full font-nunito overflow-hidden">
                <NavSidebar recentProjects={recentProjects} />

                <div className="flex flex-col flex-1 overflow-hidden">
                    <SidebarInset className="flex flex-col flex-1 overflow-hidden">
                        <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <BreadcrumbsGenerator />
                            </div>
                            <ThemeToggle />
                        </header>

                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>

    );
}

export default DashboardLayout;
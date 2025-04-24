import { SidebarLayout } from "@/components/navigation/SidebarLayout";
import { UserAppRoleProvider } from "@/context/UserAppRoleContext";
import { childRequiresNav } from "@/lib/NavigationUtils";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const pathname = (await headers()).get('X-Current-Route');
    const requiresNavigation = childRequiresNav(pathname);

    return (
        <>
            {
                requiresNavigation ? (
                    <UserAppRoleProvider>
                        <SidebarLayout >
                            {children}
                        </SidebarLayout>
                    </UserAppRoleProvider>
                ) : (
                    <div></div>
                )
            }
        </>

    );
}

export default DashboardLayout;
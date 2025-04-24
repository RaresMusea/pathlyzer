import { SidebarLayout } from "@/components/navigation/SidebarLayout";
import { childRequiresNav } from "@/lib/NavigationUtils";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const pathname = (await headers()).get('X-Current-Route');

    console.log('DashboardLayout pathname:', pathname);
    const requiresNavigation = childRequiresNav(pathname);

    return (
        <>
            {
                requiresNavigation ? (
                    <SidebarLayout children={children} />
                ) : (
                    <div></div>
                )
            }
        </>

    );
}

export default DashboardLayout;
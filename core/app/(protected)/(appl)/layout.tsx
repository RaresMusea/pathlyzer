import { getAccountAuthProvider } from "@/app/service/account/accountService";
import { createAuthorizedUserStats, getUserStats } from "@/app/service/user/userStatsService";
import { SidebarLayout } from "@/components/navigation/SidebarLayout";
import { UserAppRoleProvider } from "@/context/UserAppRoleContext";
import { childRequiresNav } from "@/lib/NavigationUtils";
import { UserStatsDto } from "@/types/types";
import { headers } from "next/headers";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const pathname = (await headers()).get('X-Current-Route');
    const requiresNavigation = childRequiresNav(pathname);

    let userStats: UserStatsDto | null = await getUserStats();

    if (!userStats) {
        const accountProvider: string | null = await getAccountAuthProvider();

        if (accountProvider === 'google' || accountProvider == 'github') {
            userStats = await createAuthorizedUserStats();
        }
    }

    if (!userStats) {
        throw new Error('No user stats found for this user account!');
    }

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
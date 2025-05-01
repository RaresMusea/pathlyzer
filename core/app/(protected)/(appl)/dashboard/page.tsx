import { getAccountAuthProvider } from "@/app/service/account/accountService";
import { createAuthorizedUserStats, getUserStats } from "@/app/service/user/userStatsService"
import { UserStatsDto } from "@/types/types";

export default async function DashboardPage() {
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
        <div className="flex flex-1 h-screen w-full flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    )
}
import { getUserStats } from "@/app/service/user/userStatsService";
import { auth } from "@/auth";
import { XpCard } from "@/components/dashboard/XpCard";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { DashboardLoadError } from "@/components/misc/errors/DashboardLoadError";
import { UNAUTHORIZED_REDIRECT } from "@/routes";
import { UserStatsDto } from "@/types/types";
import { redirect } from "next/navigation";

const formatUserName = (name: string | null | undefined): string => {
    if (!name) return '';

    const firstName = name.trim().split(' ')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};


export default async function DashboardPage() {
    const user = await auth();
    const userStats: UserStatsDto | null = await getUserStats();

    if (!user || !user.user) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    if (!userStats) {
        <DashboardLoadError backText="Back home" backUrl="/" />
    }

    return (
        <PageTransition>
            <div className="container mx-auto font-nunito px-4 space-y-8">
                <div>
                    <h1 className="text-3xl px-6 font-semibold mb-0 pb-0 space-y-0">Hello, {formatUserName(user.user.name)}! 👋</h1>
                    <p className="font-normal font-nunito px-6 space-y-0">Here&apos;a summary of your learning progress.</p>
                </div>
                <div className="flex flex-1 h-screen w-full flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                        <div className="aspect-video rounded-xl bg-muted/50">
                            <XpCard xp={userStats?.xp ?? 0} level={userStats?.level ?? 0} />
                        </div>
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div>
            </div>
        </PageTransition>
    )
}
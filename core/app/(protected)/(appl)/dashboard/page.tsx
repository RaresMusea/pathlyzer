import { getCurrentUserLearningDurationTotal, getLearningSession, getLongestLearningStreak } from "@/app/service/learning/learning-session/learningSessionService";
import { getUserCooldown } from "@/app/service/user/cooldownService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { auth } from "@/auth";
import { LearningTimeCard } from "@/components/dashboard/LearningTimeCard";
import { LivesCard } from "@/components/dashboard/LivesCard";
import { XpCard } from "@/components/dashboard/XpCard";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { DashboardLoadError } from "@/components/misc/errors/DashboardLoadError";
import { GamificationProvider } from "@/context/GamificationContext";
import { UNAUTHORIZED_REDIRECT } from "@/routes";
import { UserStatsDto } from "@/types/types";
import { UserCooldown } from "@prisma/client";
import { redirect } from "next/navigation";

const formatUserName = (name: string | null | undefined): string => {
    if (!name) return '';

    const firstName = name.trim().split(' ')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};


export default async function DashboardPage() {
    const user = await auth();
    const userStats: UserStatsDto | null = await getUserStats();
    const userCooldown: UserCooldown | null = await getUserCooldown();
    const totalLearningTime: number = await getCurrentUserLearningDurationTotal();
    const longestLearningStreak: number = await getLongestLearningStreak();

    console.log(userCooldown);

    if (!user || !user.user) {
        redirect(UNAUTHORIZED_REDIRECT);
    }

    if (!userStats) {
        return <DashboardLoadError backText="Back home" backUrl="/" />
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
                        <XpCard xp={userStats?.xp ?? 0} level={userStats?.level ?? 0} />
                        <GamificationProvider initialUserStats={userStats}>
                            <LivesCard lives={userStats.lives ?? 0} cooldownDuration={userCooldown ? userCooldown?.durationMinutes: 0} cooldownReason={userCooldown? userCooldown?.reason : undefined} />
                        </GamificationProvider>
                        <LearningTimeCard learningTime={totalLearningTime} longestStreak={longestLearningStreak} />

                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                        
                </div>
            </div>
        </PageTransition>
    )
}
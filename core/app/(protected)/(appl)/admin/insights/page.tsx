import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function InsightsPage() {
    const session = await auth();

    if (session?.user.role !== "ADMINISTRATOR") {
        redirect("/unauthorized")
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Insights</h1>
            <p className="text-sm text-muted-foreground">This is the insights page.</p>
        </div>
    )
}
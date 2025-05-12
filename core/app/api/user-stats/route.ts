import { getAccountAuthProvider } from "@/app/service/account/accountService";
import { getStatsByUserId } from "@/app/service/user/userStatsService";
import { auth } from "@/auth";
import { UserStats } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
    console.log(request);
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const userId: string | undefined = session.user.id;

    if (!userId) {
        return NextResponse.json({ message: 'The user ID cannot be empty!' }, { status: 500 });
    }

    const provider: string | null = await getAccountAuthProvider();

    if (!provider) {
        return NextResponse.json({ message: 'The user does not use auth providers!' }, { status: 204 });
    }

    const userStats: UserStats | null = await getStatsByUserId(userId);

    if (!userStats) {
        return NextResponse.json({ message: 'The stats for this user could not be found' }, { status: 404 });
    }
    else {
        return NextResponse.json({ userStats }, { status: 200 });
    }
}
import { ENDPOINT_ROOT } from "@/types/types";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { projectName, template, framework, description } = await request.json();

        const response = await axios.post(`${ENDPOINT_ROOT}/project`, {
            projectName,
            template,
            framework,
            description
        });

        return NextResponse.json({ projectPath: response.data.projectPath }, { status: 201 });
    } catch (error) {
        return new NextResponse(error.response?.data?.message || "Internal Server Error", { status: error.response?.status || 500 });
    }
}

export async function HEAD(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ message: "Missing key parameter" }, { status: 400 });
    }

    try {
        const response = await axios.head(`${ENDPOINT_ROOT}/project?q=${encodeURIComponent(q as string)}`);
        return new NextResponse(null, { status: response.status });

    } catch (error) {
        return NextResponse.json({ error: "Failed to retreive project data" }, { status: error.status });
    }
}
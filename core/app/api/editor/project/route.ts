import { createProject, projectAlreadyExists } from "@/app/service/project/projectService";
import { auth } from "@/auth";
import { ProjectCreationDto } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const { projectData, projectId, ownerId, projectPath } = await request.json();

    const newProject: ProjectCreationDto = {
        projectData,
        projectId,
        projectPath,
        ownerId,
    };

    if (!newProject) {
        return NextResponse.json({ message: "Missing project data!" }, { status: 400 });
    }

    if (await projectAlreadyExists(newProject.projectData.projectName, newProject.ownerId)) {
        return NextResponse.json({ message: "A project with the same name already exists!" }, { status: 409 });
    }

    //TODO Add more validation

    try {
        const createdProject = await createProject(newProject);

        if (createdProject) {
            return NextResponse.json({ message: "Project created successfully!" }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ message: error.response?.data?.message || "An error occurred while creating the project!" }, { status: 500 });
    }

    return NextResponse.json({ message: "Unexpected error!" }, { status: 500 });
}
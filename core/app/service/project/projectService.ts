import { ENDPOINT_ROOT, Project, ProjectCreationDto } from "@/types/types";
import { db } from "@/persistency/Db";
import { ProjectVisibility } from "@prisma/client";

export async function getProjects(key: string): Promise<Project[] | null> {
    if (!key) {
        throw new Error('The key was not specified!');
    }

    try {
        const token = process.env.EXPRESS_API_SECRET_KEY as string;
        const res = await fetch(`${ENDPOINT_ROOT}/project?q=${encodeURIComponent(key)}`, {
            headers: {
                'X-API-KEY': token,
            }
        });

        if (res.status === 404) {
            return [];
        }

        if (!res.ok) {
            throw new Error('An error occurred while attempting to fetch all of your projects.');
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function projectAlreadyExists(projectName: string, userId: string): Promise<boolean> {
    const project = await db.project.findFirst({
        where: {
            name: projectName,
            ownerId: userId
        }
    });

    return !!project;
}

export async function createProject(payload: ProjectCreationDto) {
    try {
        return await db.project.create({
            data: {
                id: payload.projectId,
                name: payload.projectData.projectName,
                template: payload.projectData.template,
                framework: payload.projectData.framework,
                description: payload.projectData.description || "",
                visibility: payload.projectData.visibility.toUpperCase() as ProjectVisibility,
                awsRelativePath: payload.projectPath,
                ownerId: payload.ownerId,
            }
        });
    } catch (error) {
        console.error("Error creating project:", error);
        throw new error('Database error occurred while creating the project!');
    }
}

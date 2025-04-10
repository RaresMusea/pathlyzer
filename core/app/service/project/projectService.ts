import { ENDPOINT_ROOT, Project, ProjectCreationDto, ProjectData, ProjectDetails } from "@/types/types";
import { db } from "@/persistency/Db";
import { ProjectVisibility } from "@prisma/client";

export async function getProjects(key: string, ownerId: string): Promise<ProjectData[] | null> {
    try {
        const awsProjects: Project[] | null = await getAwsProjects(key);
        const projectsDetails: ProjectDetails[] = await getProjectsDetails(ownerId);

        if (!awsProjects || !projectsDetails || awsProjects.length !== projectsDetails.length) {
            return null;
        }

        const mergedResponse: ProjectData[] = awsProjects.map(project => {
            const details = projectsDetails.find(detail => detail.path === project.path);

            if (details) {
                return {
                    ...project,
                    ...details,
                };
            }

            return null;
        }).filter((project): project is ProjectData => project !== null);

        if (mergedResponse.length !== awsProjects.length) {
            throw new Error('The number of projects does not match!');
        }

        return mergedResponse;

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

async function getAwsProjects(key: string): Promise<Project[] | null> {
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

async function getProjectsDetails(userId: string): Promise<ProjectDetails[]> {
    if (!userId) {
        throw new Error('Unauthorized!');
    }
    
    const projects = await db.project.findMany({
        where: {
            ownerId: userId
        },
        select: {
            id: true,
            description: true,
            template: true,
            framework: true,
            visibility: true,
            awsRelativePath: true,
        }
    });

    return projects.map(project => ({
        ...project,
        description: project.description ?? undefined,
        path: project.awsRelativePath,
        framework: project.framework ?? undefined,
    }));
}
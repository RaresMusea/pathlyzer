import { getRecentProjects } from "@/app/service/project/projectService";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { NavProjects } from "@/types/types";

export const mapRecentProjectsToNavItems = async(key: string, ownerId: string): Promise<NavProjects[]> => {
    const recentProjects = await getRecentProjects(key, ownerId);

    if (!recentProjects) return [];

    return recentProjects.map((project) => ({
        title: project.name,
        url: `/editor/${encodeURIComponent(project.path)}`,
        icons : [getLogoBasedOnTech(project.template, 'dark'), getLogoBasedOnTech(project.framework || '', 'dark')]
    }));
}
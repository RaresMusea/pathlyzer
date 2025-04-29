import { getRecentProjects } from "@/app/service/project/projectService";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { MainNavigationUnwrappedProps, NavProjects } from "@/types/types";

export const mapRecentProjectsToNavItems = async (key: string, ownerId: string): Promise<NavProjects[]> => {
    const recentProjects = await getRecentProjects(key, ownerId);

    if (!recentProjects) return [];

    return recentProjects.map((project) => ({
        title: project.name,
        url: `/editor/${encodeURIComponent(project.path)}`,
        icons: [getLogoBasedOnTech(project.template, 'dark'), getLogoBasedOnTech(project.framework || '', 'dark')]
    }));
}

export const childRequiresNav = (childRoute: string | null): boolean => {
    if (!childRoute) return false;
    
    const excludedRoutesPatterns = ['editor'];
    return !excludedRoutesPatterns.some(pattern => childRoute.includes(pattern));
}

export const markActive = (items: MainNavigationUnwrappedProps[], pathname: string): MainNavigationUnwrappedProps[] => {
    return items.map(item => ({
        ...item,
        isActive: pathname.startsWith(item.url),
        items: item.items || [],
    }));
}
import { ENDPOINT_ROOT, Project } from "@/types/types";

export async function getProjects(key: string): Promise<Project[] | null> {
    if (!key) {
        throw new Error('The key was not specified!');
    }

    try {
        const res = await fetch(`${ENDPOINT_ROOT}/project?q=${encodeURIComponent(key)}`);

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
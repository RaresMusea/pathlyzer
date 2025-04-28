import { CourseDifficulty, CourseTag } from "@prisma/client";
import { LucideIcon } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const PORT: number = 3001;
export const ENDPOINT_ROOT: string = `http://localhost:${PORT}`;
export const EXECUTION_ENGINE_URI: string = `ws://localhost:3001`;

// #region Project-related types

export type Project = {
    name: string;
    path: string
    lastModified: string
};

export type ProjectDetails = {
    id: string;
    description?: string;
    template: string;
    framework?: string;
    visibility: string
    path: string;
};

export type ProjectData = Project & ProjectDetails;

export type ProjectCreationPayload = {
    projectName: string,
    description?: string | null,
    template: string,
    framework?: string | null,
    visibility: string
}

// #endregion


// #region File-Manager-related types

export enum Type {
    FILE,
    DIRECTORY,
    DUMMY
}

interface CommonProps {
    id: string;
    type: Type;
    name: string;
    content?: string;
    path: string;
    parentId: string | undefined;
    depth: number;
}

export interface IFile extends CommonProps {
    iconUrl?: string | undefined;
}

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

export interface Directory extends CommonProps {
    files: IFile[];
    dirs: Directory[];
}

// #endregion

// #region Code Editor-related types

export interface FileCreationResult {
    name: string;
    parentDir: string;
    path: string;
}

export interface Tab {
    id: string;
    name: string;
    imageUrl: string | StaticImport;
}

// #endregion

export type ProjectCreationDto = {
    projectData: ProjectCreationPayload;
    projectId: string;
    projectPath: string;
    ownerId: string;
}


// #region Navigation-related types

export type MainNavigationProps = {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string,
            icons?: string[]
        }[]
    }[]
};

export type MainNavigationUnwrappedProps = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string,
        icons?: string[]
    }[]
}

export interface NavProjects {
    title: string;
    url: string;
    icons?: string[];
}

// #endregion


// #region Course-related types

export type CourseDto = {
    id: string;
    name: string;
    imageSrc: string;
    description: string;
    difficulty: CourseDifficulty;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    tags: {
        id: string;
        name: string;
    }[];
}

export type CourseMutationDto = {
    name: string
    description: string
    difficulty: CourseDifficulty
    available: boolean
    tags: CourseTag[]
}

// #endregion
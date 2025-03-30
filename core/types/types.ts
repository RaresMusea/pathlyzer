import { StaticImport } from "next/dist/shared/lib/get-img-props";

const PORT: number = 3001;
export const ENDPOINT_ROOT: string = `http://localhost:${PORT}`;
export const EXECUTION_ENGINE_URI: string = `ws://localhost:3001`;

// #region Project-related types

export type Project = {
    name: string
    description?: string
    path: string
    lastModified: string
};

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
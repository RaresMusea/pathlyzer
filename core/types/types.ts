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
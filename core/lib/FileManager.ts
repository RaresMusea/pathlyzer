import { Directory, IFile, RemoteFile, Type } from "@/types/types";

export const buildFileTree = (data: RemoteFile[]): Directory => {
    console.log("DATA", data);

    const dirs = data.filter(x => x.type === "dir");
    const files = data.filter(x => x.type === "file");
    const cache = new Map<string, Directory | IFile>();

    const rootDir: Directory = {
        id: "root",
        name: "root",
        parentId: undefined,
        type: Type.DIRECTORY,
        path: "",
        depth: 0,
        dirs: [],
        files: []
    };

    dirs.forEach((item) => {
        const dir: Directory = {
            id: item.path,
            name: item.name,
            path: item.path,
            parentId: item.path.split("/").length === 2 ? "0" : dirs.find(x => x.path === item.path.split("/").slice(0, -1).join("/"))?.path,
            type: Type.DIRECTORY,
            depth: 0,
            dirs: [],
            files: []
        };

        cache.set(dir.id, dir);
    });

    console.log("CACHE", cache);

    files.forEach((item) => {
        const file: IFile = {
            id: item.path,
            name: item.name,
            path: item.path,
            parentId: item.path.split("/").length === 2 ? "0" : dirs.find(x => x.path === item.path.split("/").slice(0, -1).join("/"))?.path,
            type: Type.FILE,
            depth: 0
        };
        cache.set(file.id, file);
    });

    cache.forEach((value) => {
        if (value.parentId === "0") {
            if (value.type === Type.DIRECTORY) rootDir.dirs.push(value as Directory);
            else rootDir.files.push(value as IFile);
        } else {
            const parentDir = cache.get(value.parentId as string) as Directory;
            if (value.type === Type.DIRECTORY)
                parentDir.dirs.push(value as Directory);
            else parentDir.files.push(value as IFile);
        }
    });

    getDepth(rootDir, 0);
    return rootDir;
}

export const findFileByName = (rootDir: Directory, filename: string): (IFile | undefined) => {
    let targetFile: IFile | undefined = undefined;

    function findFile(rootDir: Directory, filename: string) {
        rootDir.files.forEach((file) => {
            if (file.name === filename) {
                targetFile = file;
                return;
            }
        });
        rootDir.dirs.forEach((dir) => {
            findFile(dir, filename);
        });
    }

    findFile(rootDir, filename);
    return targetFile;
}

export const isValidDirectoryName = (name: string): boolean => {
    if (!name.trim()) {
        console.log("Name is empty or contains only spaces.");
        return false;
    }

    const invalidChars = /[<>:"\/\\|?*.]/;
    const isValid = !invalidChars.test(name);
    return isValid;
};

export const sortDir = (l: Directory, r: Directory) => {
    return l.name.localeCompare(r.name);
}

export const sortFile = (l: IFile, r: IFile) => {
    return l.name.localeCompare(r.name);
}

export const getLanguageBasedOnExtension = (extension: string | undefined): string => {
    if (extension === 'py') return 'python';
    if (extension === "xml") return "xml";
    if (extension === "java") return "java";
    if (extension === 'c') return 'c';
    if (extension === 'cpp') return 'cpp';
    if (extension === 'css') return 'css';
    if (extension === 'html') return 'html';
    if (extension === 'js') return 'javascript';
    if (extension === 'json') return 'json';
    if (extension === 'md') return 'markdown';
    if (extension === 'sh') return 'shell';
    if (extension === 'sql') return 'sql';
    if (extension === 'ts' || extension === 'tsx') return 'typescript';
    if (extension === 'yml') return 'yaml';
    if (extension === 'yaml') return 'yaml';
    if (extension === 'txt') return 'plaintext';
    if (extension === 'gitignore') return 'gitignore';
    if (extension === 'properties') return 'properties';
    if (extension === 'gradle') return 'gradle';
    return 'unknown';
}

const getDepth = (rootDir: Directory, curDepth: number) => {
    rootDir.files.forEach((file) => {
        file.depth = curDepth + 1;
    });
    rootDir.dirs.forEach((dir) => {
        dir.depth = curDepth + 1;
        getDepth(dir, curDepth + 1);
    });
}
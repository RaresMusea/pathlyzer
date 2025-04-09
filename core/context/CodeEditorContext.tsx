import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IFile, RemoteFile, Type } from "@/types/types";
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useEditorTabs } from './EditorTabsContext';
import { getIcon } from '@/lib/IconRetriever';
import { FileCreationResult } from '@/types/types';

export type FileTreeCreationProps = {
    enabled: boolean;
    type: Type;
    name: string | undefined;
};

interface CodeEditorContextType {
    files: RemoteFile[];
    setFiles: (files: RemoteFile[]) => void;
    creating: FileTreeCreationProps;
    socket: Socket | null
    selectedFile: IFile | undefined;
    setSelectedFile: (file: IFile | undefined) => void;
    selectedContextMenuFile: IFile | undefined;
    setSelectedContextMenuFile: (file: IFile | undefined) => void;
    onSelect: (file: IFile) => void;
    fileToRename: IFile | undefined;
    setFileToRename: (file: IFile | undefined) => void;
    setCreating: (creationProps: FileTreeCreationProps) => void;
    handleRename: (file: IFile | undefined, newName: string | undefined) => void;
    handleDeepRename: (file: IFile | undefined, newName: string | undefined) => void;
    handleCreate: (newName: string, parentDir: string, type: Type) => void;
    handleDelete: (filePath: string, type: Type) => void;
    updateOpenedFileProps: (path: string, newContent: string | undefined) => void;
    lastDeepRenamed: IFile | undefined;
    setLastDeepRenamed: (file: IFile | undefined) => void;
}

const CodeEditorContext = createContext<CodeEditorContextType | undefined>(undefined);

export const CodeEditorProvider: React.FC<{ children: React.ReactNode, socket: Socket | null, fileStructure: RemoteFile[], rootContent: RemoteFile[] }> = ({ children, socket, fileStructure, rootContent }) => {
    const [selectedFile, setSelectedFile] = useState<IFile | undefined>(undefined);
    const [selectedContextMenuFile, setSelectedContextMenuFile] = useState<IFile | undefined>(undefined);
    const [files, setFiles] = useState<RemoteFile[]>(fileStructure);
    const [fileToRename, setFileToRename] = useState<IFile | undefined>(undefined);
    const [creating, setCreating] = useState<FileTreeCreationProps>({ enabled: false, type: Type.FILE, name: undefined });
    const [openedFiles, setOpenedFiles] = useState<Map<string, IFile>>(new Map());
    const [lastDeepRenamed, setLastDeepRenamed] = useState<IFile | undefined>(undefined);
    const selectedFileRef = useRef<IFile | undefined>(undefined);
    const { currentTab, openTab, updateTabContentAfterRenaming, updateTabsContentAfterDeepRenaming, updateTabContentAfterDeleting, tabs } = useEditorTabs();

    // #region Deep-rename callbacks
    const updateFilesAfterDeepRename = useCallback((changes: { oldPath: string, newPath: string, newName: string, children: RemoteFile[] }) => {
        setFiles((prevFiles) => {
            const updatedFiles = prevFiles.map((f) => {
                if (f.path === changes.oldPath) {
                    return {
                        ...f,
                        path: changes.newPath,
                        name: changes.newName,
                    };
                }

                if (f.path.startsWith(changes.oldPath)) {
                    const newPath = f.path.replace(changes.oldPath, changes.newPath);
                    const updatedChild = changes.children.find(child => child.path === newPath);

                    return updatedChild ? updatedChild : { ...f, path: newPath };
                }
                return f;
            });

            return updatedFiles;
        });
    }, []);

    const updateOpenedFilesAfterDeepRename = useCallback((changes: { oldPath: string, newPath: string, newName: string }) => {
        setOpenedFiles(prevOpenedFiles => {
            const updatedOpenedFiles = new Map<string, IFile>();

            prevOpenedFiles.forEach((file, path) => {
                if (path === changes.oldPath) {
                    updatedOpenedFiles.set(changes.newPath, { ...file, path: changes.newPath, name: changes.newName });
                } else if (path.startsWith(changes.oldPath)) {
                    const newPath = path.replace(changes.oldPath, changes.newPath);
                    updatedOpenedFiles.set(newPath, { ...file, path: newPath, id: newPath, parentId: changes.newName });
                } else {
                    updatedOpenedFiles.set(path, file);
                }
            });

            return updatedOpenedFiles;
        });
    }, []);

    const updateSelectedFileAfterDeepRename = useCallback((oldPath: string, newPath: string) => {
        if (selectedFileRef.current?.path.startsWith(oldPath)) {
            setSelectedFile((prevSelectedFile: IFile | undefined) => {
                if (!prevSelectedFile) return undefined;
                console.warn("PREV SEL FILE", prevSelectedFile)

                const newSelectedFile: IFile = {
                    ...prevSelectedFile,
                    id: prevSelectedFile.id.replace(oldPath, newPath),
                    path: prevSelectedFile.path.replace(oldPath, newPath),
                    name: prevSelectedFile.name,
                    type: prevSelectedFile.type,
                    parentId: (prevSelectedFile.parentId?.replace(oldPath, newPath) ?? newPath)
                };

                return newSelectedFile;
            })
        }
    }, []);

    // #endregion

    // #region Rename callbacks

    const setFilesAfterRenaming = useCallback((changes: { oldPath: string, newPath: string, newName: string, type: string }) => {
        setFiles((prevFiles) => {
            return prevFiles.map((f) => {
                if (f.path === changes.oldPath) {
                    return {
                        ...f,
                        path: changes.newPath,
                        name: changes.newName,
                    };
                }
                return f;
            });
        });
    }, []);

    // #endregion

    useEffect(() => {
        if (tabs?.length === 0) {
            setOpenedFiles(new Map());
            setSelectedFile(undefined);
        }
    }, [tabs]);

    useEffect(() => {
        const handleTabOpening = async () => {
            if (selectedFile) {
                openTab({ id: selectedFile.path, name: selectedFile.name, imageUrl: await getIcon(selectedFile.name) });
                handleFileOpen(selectedFile);
            }
        }
        handleTabOpening();

    }, [selectedFile]);

    useEffect(() => {
        if (currentTab) {
            setSelectedFile(openedFiles.get(currentTab) || undefined);
        }
    }, [currentTab]);

    useEffect(() => {
        socket?.on('renameSuccessful', async (changes: { oldPath: string, newPath: string, newName: string, type: string }) => {
            setFilesAfterRenaming(changes);

            if (changes.type === 'file') {
                const imageUrl: string = await updateTabContentAfterRenaming(changes.oldPath, changes.newPath, changes.newName);
                renamePostActions(changes, imageUrl);
            }

        });

        socket?.on('deepRenameSuccessful', (changes: { oldPath: string, newPath: string, newName: string, children: RemoteFile[] }) => {
            updateFilesAfterDeepRename(changes);
            updateOpenedFilesAfterDeepRename({ oldPath: changes.oldPath, newPath: changes.newPath, newName: changes.newName });
            updateTabsContentAfterDeepRenaming(changes.oldPath, changes.newPath);
            updateSelectedFileAfterDeepRename(changes.oldPath, changes.newPath);
        });

        socket?.on('renameError', (error: { message: string, description: string }) => {
            toast.error(error?.description || 'An error occurred while renaming the file');
        });

        return () => {
            socket?.off('renameSuccessful');
            socket?.off('deepRenameSuccessful');
            socket?.off('renameError');
        }
    }, [socket, updateFilesAfterDeepRename, updateOpenedFilesAfterDeepRename, updateTabsContentAfterDeepRenaming, updateSelectedFileAfterDeepRename, setFilesAfterRenaming]);

    useEffect(() => {
        socket?.on('fileCreated', (data: FileCreationResult) => {
            const { name, parentDir, path } = data;

            setFiles((prev: RemoteFile[]) => {
                return [...prev, { name, path, parentDir, type: "file" }];
            });

            toast.success(`File ${path} created successfully!`);
        });

        socket?.on('fileCreationFailed', (error: { message: string, description: string }) => {
            toast.error(error?.description || 'An error occurred while creating the file');
        });

        return () => {
            socket?.off('fileCreated');
            socket?.off('fileCreationFailed');
        }
    }, [socket]);

    useEffect(() => {
        socket?.on('directoryCreated', (data: FileCreationResult) => {
            const { name, parentDir, path } = data;

            setFiles((prev: RemoteFile[]) => {
                return [...prev, { name, path, parentDir, type: "dir" }];
            });

            toast.success(`Directory ${path} created successfully!`);
        });

        socket?.on('directoryCreationFailed', (error: { message: string, description: string }) => {
            toast.error(error?.description || 'An error occurred while creating the directory');
        });

        return () => {
            socket?.off('directoryCreated');
            socket?.off('directoryCreationFailed');
        }

    }, [socket]);

    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile])

    useEffect(() => {
        socket?.on('deletionSuccessful', (data: { path: string, type: string }) => {
            console.warn("SELECTED FILE COPY", selectedFileRef.current)

            setFiles((prev: RemoteFile[]) => {
                return prev.filter(f => !f.path.startsWith(data.path));
            });

            updateTabContentAfterDeleting(data.path);
            deletePostActions(data.path);

            toast.success(`Successfully deleted ${data.type} ${data.path}`);
        });

        socket?.on('entityDeletionFailed', (error: { message: string, description: string }) => {
            toast.error(error?.description || 'An error occurred while deleting the entity');
        });

        return () => {
            socket?.off('deletionSuccessful');
            socket?.off('entityDeletionFailed');
        }
    }, [socket]);

    const onSelect = useCallback((file: IFile) => {
        if (!file) return;

        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                console.log("ELEMENT", file);
                setFiles(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) =>
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
                console.log(files);
            });
        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    }, [socket]);


    const handleRename = useCallback(async (file: IFile | undefined, newName: string | undefined) => {
        if (file) {
            socket?.emit('renameEntity', {
                oldName: file.name,
                newName: newName,
                type: file.type === Type.DIRECTORY ? 'directory' : 'file',
                parentId: file.parentId
            });

            setFileToRename(undefined);
        }
    }, []);

    const handleDeepRename = (file: IFile | undefined, newName: string | undefined) => {
        if (file) {
            const affectedFiles: RemoteFile[] | undefined = files.filter(f => f.path.startsWith(file.path) && f.path !== file.path);
            socket?.emit('deepRename', {
                oldName: file.name,
                newName: newName,
                type: 'directory',
                parentId: file.parentId,
                children: affectedFiles
            });

            setFileToRename(undefined);
            setLastDeepRenamed({ ...file, name: newName!, path: file.path.replace(file.name, newName!) });
        }
    };

    const renamePostActions = (changes: { oldPath: string, newPath: string, newName: string }, imageUrl: string) => {
        const { oldPath, newPath, newName } = changes;

        setOpenedFiles((prevOpenedFiles) => {
            if (!prevOpenedFiles.has(oldPath)) return prevOpenedFiles;

            const updatedFiles = new Map(prevOpenedFiles);
            const fileData = updatedFiles.get(oldPath);

            if (fileData) {
                updatedFiles.delete(oldPath);
                updatedFiles.set(newPath, { ...fileData, id: newPath, name: newName, path: newPath, iconUrl: imageUrl });
            }

            return updatedFiles;
        });
    }

    const deletePostActions = (oldPath: string) => {
        setOpenedFiles((prevOpenedFiles) => {
            const hasMatchingKeys = Array.from(prevOpenedFiles.keys()).some(path => path.startsWith(oldPath));

            if (!hasMatchingKeys) return prevOpenedFiles;

            const updatedFiles = new Map(
                Array.from(prevOpenedFiles.entries()).filter(
                    ([path]) => !path.startsWith(oldPath)
                )
            );

            if (selectedFileRef.current?.path.startsWith(oldPath)) {
                const fileEntries: IFile[] = Array.from(updatedFiles.values());

                if (fileEntries.length > 0) {
                    setSelectedFile(fileEntries[0]);
                }
                else {
                    setSelectedFile(undefined);
                }
            }
            return updatedFiles;
        });
    }

    const handleFileOpen = useCallback(async (file: IFile) => {
        setOpenedFiles(prevOpenedFiles => {
            const newFiles = new Map<string, IFile>(prevOpenedFiles);
            newFiles.set(file.id, file);
            return newFiles;
        })
    }, []);


    const updateOpenedFileProps = useCallback((path: string, newContent: string | undefined) => {
        setOpenedFiles(prevOpenedFiles => {
            if (!prevOpenedFiles.has(path)) return prevOpenedFiles;

            const updatedFiles: Map<string, IFile> = new Map(prevOpenedFiles);
            const fileToUpdate = updatedFiles.get(path);

            if (fileToUpdate) {
                const fileName = path.split('/').pop();
                const parentPath = path.split('/').slice(0, -1).join('/');
                updatedFiles.set(path, { ...fileToUpdate, content: newContent, path: path, name: fileName!, parentId: parentPath });
            }

            return updatedFiles;
        })
    }, []);

    const handleCreate = useCallback((newName: string, parentDir: string, type: Type) => {
        if (type === Type.FILE) {
            handleFileCreation(newName, parentDir);
        } else {
            handleDirectoryCreation(newName, parentDir);
        }
    }, []);

    const handleDelete = useCallback((filePath: string, type: Type) => {
        socket?.emit('deleteEntity', { filePath, type: (type === Type.FILE) ? 'file' : 'directory' });
    }, []);

    const handleFileCreation = (newName: string, parentDir: string) => {
        socket?.emit('createFile', {
            newName,
            parentDir
        });
    };

    const handleDirectoryCreation = (newName: string, parentDir: string) => {
        socket?.emit('createDirectory', {
            newName,
            parentDir
        });
    };



    //Side-effects


    return (
        <CodeEditorContext.Provider value={{
            files,
            setFiles,
            creating,
            socket,
            selectedFile,
            setSelectedFile,
            selectedContextMenuFile,
            setSelectedContextMenuFile,
            onSelect,
            fileToRename,
            setFileToRename,
            setCreating,
            handleRename,
            handleDeepRename,
            handleCreate,
            handleDelete,
            updateOpenedFileProps,
            lastDeepRenamed,
            setLastDeepRenamed
        }}>
            {children}
        </CodeEditorContext.Provider>
    );
};

export const useCodeEditor = () => {
    const context = useContext(CodeEditorContext);
    if (!context) {
        throw new Error('useFileTree must be used within a FileTreeProvider');
    }
    return context;
};
import { useCodeEditor } from '@/context/CodeEditorContext'
import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { getIconForFile, getIconForFolder } from 'vscode-icons-js'
import styled from "@emotion/styled";
import { ChevronRight, FilePlus2, Folder } from 'lucide-react'
import { ContextMenu, ContextMenuSub, ContextMenuContent, ContextMenuItem, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Trash2, Pencil, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog'
import { CreationModal, DeletionModal, ModalType } from './modals/Modals'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Directory, IFile, Type } from '@/types/types';
import { sortDir, sortFile } from '@/lib/FileManager';
import { useTheme } from 'next-themes';

const CHEVRON_WIDTH: number = 16;

interface FileTreeProps {
    rootDir: Directory;
};

interface SubTreeProps {
    directory: Directory | undefined;
}

const SubTree = (props: SubTreeProps) => {
    const { onSelect } = useCodeEditor();

    return (
        <div className=''>
            {
                props.directory?.dirs
                    .sort(sortDir)
                    .map(dir => (
                        <React.Fragment key={dir.id}>
                            <DirDiv
                                directory={dir} />
                        </React.Fragment>
                    ))
            }
            {
                props.directory?.files
                    .sort(sortFile)
                    .map(file => (
                        <React.Fragment key={file.id}>
                            <FileDiv
                                file={file}
                                onClick={() => onSelect(file)} />
                        </React.Fragment>
                    ))
            }
        </div>
    )
}

const FileDiv = ({ file, open, onClick }: {
    file: IFile | Directory;
    icon?: string;
    open?: boolean;
    rootDir?: Directory | undefined;
    onClick: () => void;
}) => {

    const { selectedFile,
        selectedContextMenuFile,
        setSelectedContextMenuFile,
        fileToRename,
        setFileToRename,
        handleRename,
        handleDeepRename,
        handleCreate,
        handleDelete,
        lastDeepRenamed,
        setLastDeepRenamed
    } = useCodeEditor();

    const isRenaming: boolean = fileToRename !== undefined && fileToRename.id === file.id;
    const [newName, setNewName] = useState<string | undefined>(file.name);
    const [modalType, setModalType] = useState<ModalType | undefined>(undefined);
    const selectedContextMenuRef = useRef<IFile | null>(null);

    useEffect(() => {
        if (file.id === lastDeepRenamed?.path) {
            onClick();
            setLastDeepRenamed(undefined);
        }
    }, [lastDeepRenamed, file, onClick, setLastDeepRenamed]);

    useEffect(() => {
        if (modalType === ModalType.FILE_MANAGER_CREATE_FILE || modalType === ModalType.FILE_MAANGER_CREATE_DIR) {
            setNewName("");
        }
    }, [modalType])

    useEffect(() => {
        if (selectedContextMenuFile) {
            selectedContextMenuRef.current = selectedContextMenuFile;
        }
    }, [selectedContextMenuFile])

    useEffect(() => {
        if (fileToRename && fileToRename.id === file.id) {
            setNewName(fileToRename.name);
        }
    }, [fileToRename, file.id]);

    const rename = () => {
        if (newName?.trim() === file.name) {
            setFileToRename(undefined);
            return;
        }
        if (file.type === Type.DIRECTORY && newName?.trim() !== '') {
            handleDeepRename(fileToRename, newName);
            return;
        }
        if (newName?.trim() !== '') {
            handleRename(fileToRename, newName);
        }
    };

    const closeContextMenu = () => {
        const openContextMenu = document.querySelector('[role="menu"]');
        (openContextMenu as HTMLElement).style.display = 'none';
    }

    const deleteEntity = () => {
        if (selectedContextMenuRef?.current?.path) {
            handleDelete(selectedContextMenuRef?.current?.path, selectedContextMenuRef?.current?.type);
            closeDialog();
        }
        else {
            toast.error("An error occurred while attempting to delete the file. Please try again later.");
        }
    }

    const closeDialog = () => {
        setModalType(undefined);
    }

    const openDialog = () => {
        return modalType === ModalType.FILE_MAANGER_CREATE_DIR || modalType === ModalType.FILE_MANAGER_CREATE_FILE || modalType === ModalType.FILE_MANAGER_DELETE;
    }

    const isSelected = (selectedFile && selectedFile.id === file.id) as boolean;
    const depth = file.depth;
    const theme = useTheme().theme;

    return (
        <Dialog open={openDialog()} onOpenChange={(open) => !open && setModalType(undefined)}>
            <ContextMenu modal={false}>
                <ContextMenuTrigger>
                    <Div
                        theme={theme || ''}
                        depth={depth}
                        file={file}
                        isSelected={isSelected}
                        selectedContextMenuFile={selectedContextMenuFile}
                        onContextMenu={() => { setSelectedContextMenuFile(file); }}

                        onClick={onClick}>
                        <span className='flex flex-row items-center'>
                            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2, ease: 'easeInOut' }}>
                                {file.type === Type.DIRECTORY && (
                                    <ChevronRight size={16} />
                                )}
                            </motion.span>
                            <FileIcon
                                name={file.name}
                                extension={file.type === Type.FILE ? file.name.split('.').pop() || "" : undefined} />
                        </span>
                        {isRenaming ? (
                            <Input type="text"
                                autoFocus
                                value={newName}
                                onClick={(e) => e.stopPropagation()}
                                onBlur={() => setTimeout(rename, 100)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        rename();
                                    }

                                    if (e.key === 'Escape') {
                                        setFileToRename(undefined);
                                    }
                                }}
                                onChange={(e) => setNewName(e.target.value)}
                                className='h-50 w-50' />
                        ) :
                            <span style={{ marginLeft: 1 }} className='text-[0.9em]'>
                                {file.name}
                            </span>
                        }
                    </Div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    {
                        file.type === Type.DIRECTORY &&
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>Create</ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48">
                                <ContextMenuItem onClick={(e) => { e.preventDefault(); closeContextMenu(); setModalType(ModalType.FILE_MANAGER_CREATE_FILE) }}
                                    className="flex align-center justify-between">
                                    Create file
                                    <FilePlus2 className='h-4 w-4'></FilePlus2>
                                </ContextMenuItem>
                                <ContextMenuItem onClick={(e) => { e.preventDefault(); closeContextMenu(); setModalType(ModalType.FILE_MAANGER_CREATE_DIR) }}
                                    className="flex align-center justify-between">
                                    Create directory
                                    <Folder className='h-4 w-4'></Folder>
                                </ContextMenuItem>
                            </ContextMenuSubContent>
                        </ContextMenuSub>
                    }
                    <ContextMenuItem onSelect={(e) => { e.preventDefault() }}
                        onClick={() => { closeContextMenu(); setModalType(ModalType.FILE_MANAGER_DELETE); }}
                        className="flex align-center justify-between hover:bg-gray-700">
                        Delete
                        <Trash2 className="h-4 w-4" />
                    </ContextMenuItem>

                    <ContextMenuItem onClick={() => setFileToRename(selectedContextMenuFile)}
                        className="flex align-center justify-between hover:bg-gray-700">
                        Rename
                        <Pencil className="h-4 w-4" />
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => { }}
                        className="flex align-center justify-between hover:bg-gray-700">
                        Copy
                        <Copy className="h-4 w-4" />
                    </ContextMenuItem>
                    {
                        modalType === ModalType.FILE_MANAGER_DELETE &&
                        <DeletionModal type={selectedContextMenuRef?.current?.type as Type}
                            target={selectedContextMenuRef?.current as IFile}
                            onClick={deleteEntity}
                            onClose={closeDialog} />
                    }
                    {
                        modalType === ModalType.FILE_MANAGER_CREATE_FILE &&
                        <CreationModal type={Type.FILE}
                            onClose={closeDialog}
                            parent={selectedContextMenuRef.current?.path}
                            handleCreation={handleCreate} />
                    }
                    {
                        modalType === ModalType.FILE_MAANGER_CREATE_DIR &&
                        <CreationModal type={Type.DIRECTORY}
                            onClose={closeDialog}
                            parent={selectedContextMenuRef.current?.path}
                            handleCreation={handleCreate} />
                    }

                </ContextMenuContent>
            </ContextMenu>
        </Dialog>
    );
};


const DirDiv = ({ directory }: {
    directory: Directory;
}) => {
    const { selectedFile, onSelect } = useCodeEditor();

    let defaultOpen = false;

    if (selectedFile)
        defaultOpen = isChildSelected(directory, selectedFile)

    const [open, setOpen] = useState(defaultOpen);

    if (selectedFile)
        defaultOpen = isChildSelected(directory, selectedFile);

    const [dirIconUrl, setDirIconUrl] = useState('');

    useEffect(() => {
        if (!selectedFile) return;

        if (selectedFile?.parentId!.includes(directory.name)) {
            setOpen(true);
        }
    }, [selectedFile, directory.name]);

    useEffect(() => {
        const loadIcon = async () => {
            const dirIcon = await getIconForFolder(directory.name);
            setDirIconUrl(`https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${dirIcon}`);
        };
        loadIcon();
    }, [directory]);

    return (
        <>
            <FileDiv
                file={directory}
                icon={dirIconUrl}
                open={open}
                onClick={() => {
                    if (!open) {
                        onSelect(directory);
                    }

                    setOpen(!open);
                }}
            />
            {open && (
                <SubTree directory={directory} />
            )}
        </>
    );
};

const Div = styled.div<{
    file: IFile | Directory;
    depth: number;
    isSelected: boolean;
    theme: string
    selectedContextMenuFile?: IFile;
}>
    `
    display: flex;
    align-items: center;
    color: ${props => props.theme === 'dark' ? 'white' : (props.isSelected ? 'white' : 'black')};
    padding-left: ${props => props.depth * 16 + (props.file.type === Type.FILE ? CHEVRON_WIDTH : 0)}px;;
    background-color: ${props => props.isSelected ? (props.theme === 'dark' ? "#00084D" : "#1D63ED") : "transparent"};
    border: ${props => props.selectedContextMenuFile?.name === props.file.name ? (props.theme === 'dark' || props.theme === 'system'? '2px solid #1D63ED' : '2px solid #00084D') : '2px solid transparent'};
    box-shadow: ${props => props.isSelected ? 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px' : 'none'};
  
    :hover {
      cursor: pointer;
      background-color: lightgray;
      color: black;
    }
  `;

const Span = styled.span`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

const FileIcon = ({ extension, name }: { name?: string, extension?: string }) => {
    const fullFileName = `${name}.${extension}`;
    const [iconUrl, setIconUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadIcon = async () => {
            const fileIcon = extension
                ? await getIconForFile(fullFileName)
                : await getIconForFolder(name as string);
            setIconUrl(
                `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${fileIcon}`
            );

        };

        loadIcon();
    }, [extension, name, fullFileName]);

    return (
        <Span>
            {iconUrl && <Image src={iconUrl ?? ''} width={25} height={25} alt="Icon" />}
        </Span>
    )
}

const isChildSelected = (directory: Directory, selectedFile: IFile) => {
    let res: boolean = false;

    function isChild(dir: Directory, file: IFile) {
        if (selectedFile.parentId === dir.id) {
            res = true;
            return;
        }
        if (selectedFile.parentId === '0') {
            res = false;
            return;
        }
        dir.dirs.forEach((item) => {
            isChild(item, file);
        })
    }

    isChild(directory, selectedFile);
    return res;
}

export const FileTree = (props: FileTreeProps) => {
    return (
        <SubTree directory={props.rootDir} />
    )
}
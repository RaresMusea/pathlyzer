"use client";

import { RemoteFile } from "@/types/types";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { EditorComponent } from "./EditorComponent";
import { CodeEditorProvider } from "@/context/CodeEditorContext";
import { EditorTabsProvider } from '@/context/EditorTabsContext';
import { EXECUTION_ENGINE_URI } from "@/types/types";
import { Spinner } from "@heroui/spinner";

type EditorComponentWrapperProps = {
    projectId: string;
}

const useSocket = (projectId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`${EXECUTION_ENGINE_URI}?roomId=${projectId}`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [projectId]);

    return socket;
}

export const EditorComponentWrapper = (props: EditorComponentWrapperProps) => {
    const [loaded, setLoaded] = useState(false);
    const projectName: string | undefined = props.projectId.split('/').at(-1);

    const socket = useSocket(props.projectId);
    const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[] }) => {
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    if (!loaded) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md">
                <Spinner color="default" label={`Loading ${projectName || ''}...`} labelColor="foreground" />
            </div>
        )
    }

    return (
        <EditorTabsProvider>
            <CodeEditorProvider socket={socket} fileStructure={fileStructure} rootContent={fileStructure}>
                <EditorComponent />
            </CodeEditorProvider>
        </EditorTabsProvider>
    );
};
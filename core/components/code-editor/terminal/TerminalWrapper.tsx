import { useEffect } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { FitAddon } from 'xterm-addon-fit';
import { Socket } from "socket.io-client";
import dynamic from "next/dynamic";

const fitAddon = new FitAddon();

const TerminalComponent = dynamic(() => import('./Terminal').then(mod => ({ default: mod.TerminalComponent })), { ssr: false });

const TerminalWrapper = ({ socket }: { socket: Socket | null }) => {
    useEffect(() => {
        const resizeHandler = () => {
            fitAddon.fit();
        };

        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    return (
        <ResizablePanel defaultSize={30} className="overflow-hidden terminalPanel">
            {socket && <TerminalComponent socket={socket} />}
        </ResizablePanel>
    );
};

export default TerminalWrapper;
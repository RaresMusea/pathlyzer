"use client";

import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from 'xterm-addon-fit';
import "@xterm/xterm/css/xterm.css"
import { useTheme } from "next-themes";
const fitAddon = new FitAddon();

function ab2str(buf: ArrayBuffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

const getTerminalTheme = (theme: string | undefined) => ({
    background: theme === "dark" ? "#17191E" : "white",
    foreground: theme === "dark" ? "#d4d4d4" : "#17191E",
    cursor: theme === "dark" ? "white" : "black",
    selection: theme === "dark" ? "#264F78" : "#dbdbdb",
    black: theme === 'dark' ? 'white' : 'black',
    red: "#ff0000",
    green: theme === "dark" ? "#00ff00" : "#0D2818",
    yellow: theme === "dark" ? "#ffff00" : "orange",
    blue: theme === "dark" ? "#0000ff" : "#0B0033",
    magenta: theme === "dark" ? "#ff00ff" : "#370031",
    cyan: theme === "dark" ? "#00ffff" : "#1446A0",
    white: "#ffffff",
});

export const TerminalComponent = ({ socket }: { socket: Socket | null }) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const termRef = useRef<Terminal | null>(null);
    const { theme } = useTheme();


    useEffect(() => {
        if (!terminalRef.current || !socket) {
            return;
        }

        if (!termRef.current) {
            termRef.current = new Terminal({
                cursorBlink: true,
                cols: 200,
                fontSize:14,
                fontFamily: 'Consolas, "Courier New", monospace',
                theme: getTerminalTheme(theme)
            });
            termRef.current.loadAddon(fitAddon);
            termRef.current.open(terminalRef.current);
            fitAddon.fit();

            termRef.current.write("\r\n");
        }

        socket.emit("requestTerminal");
        socket.on("terminal", terminalHandler);

        function terminalHandler({ data }: { data: ArrayBuffer }) {
            if (data instanceof ArrayBuffer) {
                termRef.current?.write(ab2str(data));
            }
        }

        const disposeDataHandler = termRef.current.onData((data) => {
            socket.emit('terminalData', {
                data
            });
        });

        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });

        resizeObserver.observe(terminalRef.current);

        return () => {
            socket.emit("exit");
            socket.off("terminal", terminalHandler);
            disposeDataHandler.dispose();
            resizeObserver.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        if (termRef.current) {
            termRef.current.options.theme = getTerminalTheme(theme);
        }
    }, [theme]);

    return <div style={{ width: "100%", height: "100%", textAlign: "left", overflow: "hidden", display: 'flex' }} className="terminalPanel" ref={terminalRef}>
    </div>
}
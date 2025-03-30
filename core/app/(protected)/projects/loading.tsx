"use client";

import {Spinner} from "@heroui/spinner"

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md">
            <Spinner color="default" label="Loading projects..." labelColor="foreground" />
        </div>
    )
}
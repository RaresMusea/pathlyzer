"use client";

import {Spinner} from "@heroui/spinner"

export default function LoadingScreen() {
    return (
        <div className="inset-0 flex items-center justify-center h-full">
            <Spinner color="default" label="Loading projects..." labelColor="foreground" />
        </div>
    )
}
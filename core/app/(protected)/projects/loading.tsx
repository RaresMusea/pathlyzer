"use client";

import {Spinner} from "@heroui/spinner"

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
            <Spinner color="default" label="Loading projects..." labelColor="foreground" />
        </div>
    )
}
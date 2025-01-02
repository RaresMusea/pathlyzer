"use client";

import IconCloud from "@/components/ui/icon-cloud";

const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "c",
    "csharp",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "angular",
    "kubernetes",
    "postgresql",
    "mysql",
    "redis",
    "firebase",
    "nginx",
    "vercel",
    "linux",
    "bash",
    "jest",
    "cypress",
    "docker",
    "git",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "kotlin",
    "figma",
];

export function TechCloud() {
    return (
        <div className="relative flex sm:flex-row md:flex-row lg:flex-col xl:flex-row sm:w-full md:w-full lg:w-full xl:w-full items-center justify-center overflow-hidden bg-background px-10 pb-10">
            <IconCloud iconSlugs={slugs} />
        </div>
    );
}
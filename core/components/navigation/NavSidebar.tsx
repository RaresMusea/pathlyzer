"use client";

import type * as React from "react";
import {
    BookOpen,
    Bot,
    FolderCode,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { MainNavigation } from "./MainNavigation";
import { UserOptions } from "../user/UserOptions";
import { RoleSwitcher } from "./RoleSwitcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

const data = {
    navMain: [
        {
            title: "Projects",
            url: '/dashboard/projects',
            icon: FolderCode,
        },
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="bg-background/60 mt-0">
                <RoleSwitcher />
            </SidebarHeader>
            <SidebarContent className="bg-background/60">
                <MainNavigation items={data.navMain} />
            </SidebarContent>
            <SidebarFooter className="bg-background/60">
                <UserOptions />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

"use client";

import type * as React from "react";
import {
    BookOpen,
    Bot,
    FolderClock,
    FolderCode,
    Frame,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { MainNavigationGeneric } from "./MainNavigation";
import { UserOptions } from "../user/UserOptions";
import { RoleSwitcher } from "./RoleSwitcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NavProjects } from "@/types/types";

type NavSidebarProps = {
    recentProjects: NavProjects[];
} & React.ComponentProps<typeof Sidebar>;

const data = {
    navMain: [
        {
            title: "Recent Projects",
            icon: FolderClock,
            url: '#',
            items: [],
        },
        {
            title: 'All Projects',
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

export function NavSidebar({ recentProjects, ...sidebarProps }: NavSidebarProps) {
    const currentUser = useCurrentUser();
    const [navItems, setNavItems] = useState(data.navMain);

    useEffect(() => {
        if (recentProjects && recentProjects?.length) {
            const updated = [...data.navMain];
            updated[0] = {
                ...updated[0],
                items: recentProjects
            };
            setNavItems(updated);
        }
    }, [recentProjects]);

    if (!currentUser) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...sidebarProps}>
            <SidebarHeader className="bg-background/60 mt-0">
                <RoleSwitcher />
            </SidebarHeader>
            <SidebarContent className="bg-background/60">
                <MainNavigationGeneric items={navItems} />
            </SidebarContent>
            <SidebarFooter className="bg-background/60">
                <UserOptions />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

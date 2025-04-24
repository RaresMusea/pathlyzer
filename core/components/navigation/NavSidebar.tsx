"use client";

import type * as React from "react";
import {
    BookOpen,
    Bot,
    FolderClock,
    FolderCode,
    Frame,
    LayoutDashboard,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { MainNavigationGeneric } from "./MainNavigationGeneric";
import { UserOptions } from "../user/UserOptions";
import { RoleSwitcher } from "./RoleSwitcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MainNavigationProps, MainNavigationUnwrappedProps, NavProjects } from "@/types/types";
import { usePathname, useRouter } from "next/navigation";

type NavSidebarProps = {
    recentProjects: NavProjects[];
} & React.ComponentProps<typeof Sidebar>;

type NavDataType = {
    navMain: MainNavigationUnwrappedProps[];
}

const data: {navMain: MainNavigationUnwrappedProps[]} = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            isActive: true,
            icon: LayoutDashboard,
            items: [],
        },
        {
            title: "Recent Projects",
            icon: FolderClock,
            isActive: false,
            url: '#',
            items: [],
        },
        {
            title: 'All Projects',
            url: '/projects',
            icon: FolderCode,
            items: [],
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
}

export function NavSidebar({ recentProjects, ...sidebarProps }: NavSidebarProps) {
    const currentUser = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const [navItems, setNavItems] = useState<MainNavigationUnwrappedProps[]>(data.navMain);

    useEffect(() => {
        if (recentProjects && recentProjects?.length) {
            const updated = [...data.navMain];
            updated[1] = {
                ...updated[1],
                items: recentProjects
            };
            setNavItems(updated);
        }
    }, [recentProjects]);

    useEffect(() => {    
        setNavItems(prevItems =>
            prevItems.map(item => ({
                ...item,
                isActive: pathname === item.url,
                items: item.items || [],
            }))
        );
    }, [pathname]);

    const setActiveItem = (activeItem: MainNavigationUnwrappedProps) => {
        setNavItems(prevItems =>
            prevItems.map(item => ({
                ...item,
                isActive: item.title === activeItem.title,
                items: item.items || [],
            }))
        );

        router.push(activeItem.url);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...sidebarProps}>
            <SidebarHeader className="bg-background/60 mt-0">
                <RoleSwitcher />
            </SidebarHeader>
            <SidebarContent className="bg-background/60">
                <MainNavigationGeneric items={navItems} setActiveItem={setActiveItem} />
            </SidebarContent>
            <SidebarFooter className="bg-background/60">
                <UserOptions />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

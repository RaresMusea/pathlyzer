"use client";

import type * as React from "react";
import {
    BookOpen,
    Bot,
    FolderClock,
    FolderCode,
    Frame,
    GraduationCap,
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
import { AppMode, useAppRoleContext } from "@/context/UserAppRoleContext";

type NavSidebarProps = {
    recentProjects: NavProjects[];
} & React.ComponentProps<typeof Sidebar>;


export function NavSidebar({ recentProjects, ...sidebarProps }: NavSidebarProps) {
    const currentUser = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const { navData, currentAppMode } = useAppRoleContext();
    const [navItems, setNavItems] = useState<MainNavigationUnwrappedProps[]>(navData);

    useEffect(() => {
        if (currentAppMode === AppMode.STANDARD_USER && recentProjects?.length) {
            const updated = navData.map((item, index) => {
                if (index === 1) {
                    return {
                        ...item,
                        items: recentProjects,
                    };
                }
                return item;
            });

            setNavItems(updated);
        }
    }, [recentProjects, currentAppMode]);

    useEffect(() => {
        setNavItems(navData);
    }, [navData]);

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
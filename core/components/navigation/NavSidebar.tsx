"use client";

import type * as React from "react";

import { MainNavigationGeneric } from "./MainNavigationGeneric";
import { UserOptions } from "../user/UserOptions";
import { RoleSwitcher } from "./RoleSwitcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { MainNavigationUnwrappedProps, NavProjects } from "@/types/types";
import { usePathname } from "next/navigation";
import { AppMode, useAppRoleContext } from "@/context/UserAppRoleContext";
import { markActive } from "@/lib/NavigationUtils";

type NavSidebarProps = {
    recentProjects: NavProjects[];
} & React.ComponentProps<typeof Sidebar>;


export function NavSidebar({ recentProjects, ...sidebarProps }: NavSidebarProps) {
    const currentUser = useCurrentUser();
    const pathname = usePathname();
    const { navData, currentAppMode, setActiveItem } = useAppRoleContext();
    const [navItems, setNavItems] = useState<MainNavigationUnwrappedProps[]>(navData);

    useEffect(() => {
        let updatedNavItems = navData;

        if (currentAppMode === AppMode.STANDARD_USER && recentProjects?.length) {
            updatedNavItems = updatedNavItems.map((item, index) => {
                if (index === 1) {
                    return {
                        ...item,
                        items: recentProjects,
                    };
                }
                return item;
            });
        }

        updatedNavItems = markActive(updatedNavItems, pathname);
        setNavItems(updatedNavItems);

    }, [navData, pathname, recentProjects, currentAppMode]);

    const onSetActiveItem = (newActiveItem: MainNavigationUnwrappedProps) => {
        setActiveItem(newActiveItem);

        setNavItems(prevItems =>
            prevItems.map(item => ({
                ...item,
                isActive: item.title === newActiveItem.title,
                items: item.items || [],
            }))
        );
    }

    if (!currentUser) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...sidebarProps}>
            <SidebarHeader className="bg-background/60 mt-0">
                <RoleSwitcher />
            </SidebarHeader>
            <SidebarContent className="bg-background/60">
                <MainNavigationGeneric items={navItems} setActiveItem={onSetActiveItem} />
            </SidebarContent>
            <SidebarFooter className="bg-background/60">
                <UserOptions />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
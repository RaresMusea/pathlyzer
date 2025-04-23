"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar"
import { MainNavigationProps } from "@/types/types";
import { MainNavCollapsed } from "./MainNavCollapsed";
import { MainNavExpanded } from "./MainNavExpanded";


export const MainNavigationGeneric = (props: MainNavigationProps) => {
    const { state, isMobile } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {state === 'collapsed' && !isMobile ? (
                    <MainNavCollapsed items={props.items} />
                )
                    :
                    <MainNavExpanded items={props.items} />
                }

            </SidebarMenu>
        </SidebarGroup>
    )
}
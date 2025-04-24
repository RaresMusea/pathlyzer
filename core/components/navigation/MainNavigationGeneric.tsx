"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    useSidebar,
} from "@/components/ui/sidebar"
import { MainNavigationUnwrappedProps } from "@/types/types";
import { MainNavCollapsed } from "./MainNavCollapsed";
import { MainNavExpanded } from "./MainNavExpanded";

type MainNavigationProps = {
    items: MainNavigationUnwrappedProps[],
    setActiveItem: (newActiveItem: MainNavigationUnwrappedProps) => void
}

export const MainNavigationGeneric = (props: MainNavigationProps) => {
    const { state, isMobile } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {state === 'collapsed' && !isMobile ? (
                    <MainNavCollapsed items={props.items} setActiveItem={props.setActiveItem} />
                )
                    :
                    <MainNavExpanded items={props.items} setActiveItem={props.setActiveItem} />
                }

            </SidebarMenu>
        </SidebarGroup>
    )
}
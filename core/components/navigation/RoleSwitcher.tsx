"use client";

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUserAppRoles, UserAppRole } from "@/lib/UserUtils";
import Image from "next/image";
import { getDashboardLogo } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type RoleSwitcherProps = {
    roles: {
        name: string
        icon: React.ElementType
        description?: string
    }[]
}


export function RoleSwitcher(props: RoleSwitcherProps) {
    const { isMobile } = useSidebar();
    const currentUser = useCurrentUser();
    const theme: string = useTheme().theme || "light";
    const router = useRouter();

    if (!currentUser) {
        return null;
    }

    const userAppRoles: UserAppRole[] | undefined = getUserAppRoles(currentUser.role);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {userAppRoles.length > 1 ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Image src={getDashboardLogo(theme)} width={50} height={50} alt="Dashboard logo" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userAppRoles[0].roleName}</span>
                                    <span className="truncate text-xs">{userAppRoles[0].description}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? "bottom" : "right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Roles</DropdownMenuLabel>
                            {userAppRoles.map((role, index) => (
                                <DropdownMenuItem key={index} onClick={() => { }} className="gap-2 p-2">
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <role.icon className="h-4 w-4 shrink-0" />
                                    </div>
                                    {role.roleName}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Add team</div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <div
                        onClick={() => router.push("/dashboard")}
                        className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                        <Image src={getDashboardLogo(theme)} width={70} height={70} alt="Dashboard logo" />
                    </div>
                }
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

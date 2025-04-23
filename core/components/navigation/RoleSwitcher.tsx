"use client";

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUserAppRoles, UserAppRole } from "@/lib/UserUtils";
import Image from "next/image";
import { getDashboardLogo } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";


export function RoleSwitcher() {
    const { isMobile } = useSidebar();
    const currentUser = useCurrentUser();
    const theme: string = useTheme().theme || "light";
    const router = useRouter();

    if (!currentUser) {
        return null;
    }

    const userAppRoles: UserAppRole[] | undefined = getUserAppRoles(currentUser.role);

    return (
        <SidebarMenu className="font-nunito">
            <SidebarMenuItem>
                {userAppRoles.length > 1 ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >

                                <Image src={getDashboardLogo(theme)} width={50} height={50} alt="Dashboard logo" />

                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userAppRoles[0].roleName}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg font-nunito"
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
                                    <div className="flex flex-col">
                                        <div className="font-semibold">{role.roleName}</div>
                                        <div className="text-sm">{role.description}</div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Add a new role</div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <Image onClick={() => router.push("/dashboard")} src={getDashboardLogo(theme)} width={100} height={100} alt="Dashboard logo" className="mx-auto" />
                }
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
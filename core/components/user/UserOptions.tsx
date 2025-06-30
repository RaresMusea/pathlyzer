"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut, Shield } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getUserInitials } from "@/lib/UserUtils";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import { LogoutModal } from "./LogoutModal";
import { signOut } from "next-auth/react";
import { Switch } from "../ui/switch";
import axios from "axios";
import { toast } from "sonner";

export const UserOptions = () => {
    const { isMobile } = useSidebar();
    const currentUser = useCurrentUser();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
    const [twoFaEnabled, setTwoFaEnabled] = useState<boolean>(false);

    useEffect(() => {
        const fetchTwoFaStatus = async () => {
            const response = await axios.get('/api/user/2fa');

            if (response.status === 200) {
                setTwoFaEnabled(response.data.is2FAEnabled);
            }
            else {
                console.error("Failed to fetch Two-Factor Authentication status.");
            }
        };

        fetchTwoFaStatus();

    }, []);

    if (!currentUser) {
        return null;
    }

    const deauth = () => {
        signOut();
    };

    const closeLogoutDialog = () => {
        setLogoutDialogOpen(false);
    };

    const handleToggle2FA = async (checked: boolean) => {
        try {
            const response = await axios.patch('/api/user/2fa', { enabled: checked });

            if (response.status === 200) {
                setTwoFaEnabled(checked);
                toast.success(`Two-Factor Authentication ${checked ? "enabled" : "disabled"}!`);
            } else {
                toast.error("Failed to update Two-Factor Authentication settings.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred while updating the Two-Factor Authentication settings.");
        }
    };

    return (
        <SidebarMenu className="!font-nunito">
            <SidebarMenuItem>
                <Dialog open={logoutDialogOpen} onOpenChange={(open) => !open ? setLogoutDialogOpen(false) : setLogoutDialogOpen(true)}>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={currentUser.image ?? ""} alt="User's profile avatar" />
                                    <AvatarFallback className="rounded-lg">{getUserInitials(currentUser?.name || undefined)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{currentUser.username}</span>
                                    <span className="truncate text-xs">{currentUser.name}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] font-nunito min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={currentUser.image || undefined} alt="Current user's profile picture" />
                                        <AvatarFallback className="rounded-lg">{getUserInitials(currentUser?.name || undefined)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{currentUser.username}</span>
                                        <span className="truncate text-xs">{currentUser.name}</span>
                                    </div>
                                    {
                                        currentUser.role !== UserRole.ADMINISTRATOR ?
                                            <BadgeCheck className="h-4 w-4 text-green-500" /> :
                                            <Shield className="h-4 w-4 text-blue-500" />
                                    }
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <div className="flex items-center gap-4 justify-between">
                                        <span>Two-Factor Authentication</span>
                                        <Switch
                                            checked={twoFaEnabled}
                                            onCheckedChange={handleToggle2FA}
                                        />
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <BadgeCheck />
                                    Account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell />
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setLogoutDialogOpen(true) }} className="cursor-pointer">
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <LogoutModal deauth={deauth} closeDialog={closeLogoutDialog} />
                </Dialog>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LogoutButton } from "./LogoutButton";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
    const currentUser = useCurrentUser();
    console.log(currentUser?.image);
    

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <Avatar>
                    <AvatarImage src={currentUser?.image || ""}/>
                    <AvatarFallback className="bg-sky-500 p-4">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 align-end">
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2"></ExitIcon>
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};
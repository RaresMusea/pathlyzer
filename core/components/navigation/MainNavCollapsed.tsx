"use client";

import { MainNavigationProps } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

export const MainNavCollapsed = (props: MainNavigationProps) => {
    return (
        <section className="font-nunito">
            {props.items.map((item) => (
                <>
                    {item.items && item.items.length > 0 ?
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive={item.isActive}
                                >
                                    {item.icon && <item.icon />}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                                <DropdownMenuLabel>
                                    {item.title}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {item.items?.map((subItem) => (
                                        <DropdownMenuItem
                                            key={subItem.title}
                                        >
                                            <Link href={subItem.url}>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <Link href={item.url}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={item.isActive}
                            >
                                {item.icon && <item.icon />}
                            </SidebarMenuButton>
                        </Link>
                    }
                </>
            ))}
        </section>
    )
}
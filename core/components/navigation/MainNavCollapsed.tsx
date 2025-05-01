"use client";

import { MainNavigationUnwrappedProps } from "@/types/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

export const MainNavCollapsed = ({ items, setActiveItem }: { items: MainNavigationUnwrappedProps[], setActiveItem: (activeItemTitle: MainNavigationUnwrappedProps) => void }) => {
    const exclude: string[] = ['Recent Projects'];

    return (
        <section className="font-nunito">
            {items.map((item, index) => (
                <div key={index}>
                    {item.items && item.items.length > 0 ?
                        <DropdownMenu onOpenChange={(isOpen) => isOpen && setActiveItem(item)}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    onClick={() => setActiveItem(item)}
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
                        <>
                            {!exclude.includes(item.title) &&
                                <Link href={item.url}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        onClick={() => setActiveItem(item)}
                                        isActive={item.isActive}
                                    >
                                        {item.icon && <item.icon />}
                                    </SidebarMenuButton>
                                </Link>
                            }
                        </>
                    }
                </div>
            ))}
        </section>
    )
}
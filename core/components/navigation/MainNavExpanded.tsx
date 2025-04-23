import { MainNavigationProps, MainNavigationUnwrappedProps } from "@/types/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const MainNavExpanded = ({ items, setActiveItem }: { items: MainNavigationUnwrappedProps[], setActiveItem: (newActiveItem: MainNavigationUnwrappedProps) => void }) => {
    const router = useRouter();
    const exclude: string[] = ['Recent Projects'];

    return (
        <>
            {items.map((item, index) => (
                item.items && item.items.length > 0 ? (
                    <Collapsible key={index} asChild defaultOpen={item.isActive} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title} isActive={item.isActive} onClick={() => setActiveItem(item)}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {item.items?.map((subItem, index) => (
                                        <SidebarMenuSubItem key={index}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={subItem.url} className="flex items-center justify-between flex-row">
                                                    <span>{subItem.title}</span>
                                                    <div className="flex">
                                                        {subItem.icons && subItem.icons.map((icon, index) => (
                                                            <div key={index}>
                                                                <Image src={icon} alt={subItem.title} width={20} height={20} className="h-4 w-4 ml-2" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ) :
                    <div key={index}>
                        {
                            !exclude.includes(item.title) &&
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title} onClick={() => setActiveItem(item)} isActive={item.isActive}>
                                    <div className="flex cursor-pointer">
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span>{item.title}</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        }
                    </div>
            ))
            }
        </>
    )
}
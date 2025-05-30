"use client"

import {ChevronRight} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";
import {NavItem} from "@/app/(dashboard)/_utils/types";

export function NavMain({
                            items,
                        }: {
    items: NavItem[]
}) {
    const pathname = usePathname();

    // Helper function to check if any sub-items match the current path
    const shouldExpandGroup = (items: Array<{ url: string }>) => {
        return items.some(item => pathname.startsWith(item.url));
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // Check if the item has sub-items
                    const hasSubItems = item.items && item.items.length > 0;
                    return hasSubItems ? (
                        // If it has sub-items, use the Collapsible component
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.initiallyExpanded || shouldExpandGroup(item.items || [])}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <a href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        // If no sub-items, render a simple menu item with direct link
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={pathname === item.url}>
                                <a href={item.url}>
                                    {item.icon && <item.icon/>}
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
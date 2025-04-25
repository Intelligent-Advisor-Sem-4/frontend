"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarSkeleton() {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="p-4 border-b">
                <Skeleton className="h-8 w-3/4" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 p-2 overflow-auto">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Skeleton className="h-4 w-20" />
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {/* Generate 5 skeleton menu items */}
                        {Array(5).fill(0).map((_, i) => (
                            <SidebarMenuItem key={i}>
                                <SidebarMenuButton className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-md" /> {/* Icon skeleton */}
                                    <Skeleton className="h-4 w-24" /> {/* Text skeleton */}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}

                        {/* One expanded menu item with sub-items */}
                        <SidebarMenuItem>
                            <SidebarMenuButton className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-md" /> {/* Icon skeleton */}
                                <Skeleton className="h-4 w-20" /> {/* Text skeleton */}
                                <Skeleton className="h-4 w-4 ml-auto" /> {/* Chevron skeleton */}
                            </SidebarMenuButton>
                            <div className="pl-8 mt-2 space-y-2">
                                {Array(3).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-20" /> /* Sub-item skeleton */
                                ))}
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </div>

            {/* Footer Skeleton */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar skeleton */}
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" /> {/* Name skeleton */}
                        <Skeleton className="h-3 w-16" /> {/* Role skeleton */}
                    </div>
                </div>
            </div>
        </div>
    )
}
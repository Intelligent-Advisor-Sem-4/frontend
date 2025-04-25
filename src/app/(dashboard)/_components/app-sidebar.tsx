'use server'

import * as React from "react"
import {NavUser} from "@/app/(dashboard)/_components/nav-user"
import {SidebarHeading} from "@/app/(dashboard)/_components/sidebar-heading"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {getCurrentUser} from "@/actions/auth";
import AppSidebarLinks from "@/app/(dashboard)/_components/app-sidebar-links";

export async function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <Sidebar>
                <SidebarHeader>
                    <SidebarHeading/>
                </SidebarHeader>
                <SidebarContent>
                    <div className="flex items-center justify-center h-full">
                        <h1 className="text-2xl font-bold">Please log in</h1>
                    </div>
                </SidebarContent>
            </Sidebar>
        )
    }
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarHeading role={user.role}/>
            </SidebarHeader>
            <SidebarContent>
                <AppSidebarLinks role={user.role}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}

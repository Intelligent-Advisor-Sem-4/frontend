import {AppSidebar} from "@/app/(dashboard)/_components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {Bell, LogOut} from "lucide-react"
import {ModeToggle} from "@/components/ThemeProvider";
import {Button} from "@/components/ui/button";
import {logout} from "@/actions/auth";
import React, {Suspense} from "react";
import {SidebarSkeleton} from "@/app/(dashboard)/_components/sidebar-skeleton";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider className={'h-screen w-screen flex overscroll-auto'}>
            <Suspense fallback={<SidebarSkeleton/>}>
                <AppSidebar/>
            </Suspense>
            <SidebarInset>
                <header
                    className="flex h-16 items-center justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b-1 shadow-sm">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1"/>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                        <ModeToggle/>
                        <Separator
                            orientation="vertical"
                            className="data-[orientation=vertical]:h-4"/>
                        <Button variant={"ghost"} size={"icon"}>
                            <Bell size={16}/>
                        </Button>
                        <Separator
                            orientation="vertical"
                            className="data-[orientation=vertical]:h-4"
                        />
                        <Button variant={'ghost'} size={'icon'} onClick={logout}>
                            <LogOut size={16}/>
                        </Button>
                    </div>
                </header>
                <div className="flex-1 overflow-auto">
                    {children}
                    {/*<footer>*/}
                    {/*    <Separator/>*/}
                    {/*    <div className="flex items-center justify-center px-4 py-6 text-sm text-muted-foreground">*/}
                    {/*        <span>© 2024 - Sem 4 Group J</span>*/}
                    {/*    </div>*/}
                    {/*</footer>*/}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
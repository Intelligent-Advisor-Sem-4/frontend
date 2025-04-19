import {AppSidebar} from "@/app/(dashboard)/_components/app-sidebar"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar"
import {Bell, LogOut} from "lucide-react"
import {ModeToggle} from "@/components/ThemeProvider";
import {Button} from "@/components/ui/button";
import {logout} from "@/actions/auth";
import React from "react";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar/>
			<SidebarInset>
				<header
					className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
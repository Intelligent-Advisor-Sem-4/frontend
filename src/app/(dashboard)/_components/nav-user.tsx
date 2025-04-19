"use client"

import { useState, useEffect } from "react"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react"

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
import { Skeleton } from "@/components/ui/skeleton"
import { getUser } from "@/actions/auth"
import {User} from "@/lib/types";

export function NavUser() {
	const { isMobile } = useSidebar()
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUser()
				if (userData) {
					setUser(userData)
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchUser()
	}, [])

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{isLoading ? (
								<>
									<Skeleton className="h-8 w-8 rounded-lg" />
									<div className="grid flex-1 text-left gap-1">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</>
							) : (
								<>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={user?.avatar} alt={user?.name} />
										<AvatarFallback className="rounded-lg">
											{user?.name?.slice(0, 2) || "UN"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{user?.name}</span>
										<span className="truncate text-xs">{user?.email}</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</>
							)}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{isLoading ? (
							<div className="p-2">
								<div className="flex items-center gap-2 px-1 py-1.5">
									<Skeleton className="h-8 w-8 rounded-lg" />
									<div className="grid flex-1 gap-1 w-full">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
								</div>
								<DropdownMenuSeparator />
								<div className="space-y-1 p-1">
									<Skeleton className="h-8 w-full" />
									<Skeleton className="h-8 w-full" />
									<Skeleton className="h-8 w-full" />
								</div>
							</div>
						) : (
							<>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage src={user?.avatar} alt={user?.name} />
											<AvatarFallback className="rounded-lg">
												{user?.name?.slice(0, 2) || "UN"}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">{user?.name}</span>
											<span className="truncate text-xs">{user?.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<Sparkles className="mr-2 h-4 w-4" />
										Upgrade to Pro
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem>
										<BadgeCheck className="mr-2 h-4 w-4" />
										Account
									</DropdownMenuItem>
									<DropdownMenuItem>
										<CreditCard className="mr-2 h-4 w-4" />
										Billing
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Bell className="mr-2 h-4 w-4" />
										Notifications
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
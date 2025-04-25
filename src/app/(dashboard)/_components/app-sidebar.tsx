"use client"

import * as React from "react"
import {Bot, DollarSign, FolderGit2, LayoutGrid, PieChart, Scale, Settings2, Users,} from "lucide-react"

import {NavMain} from "@/app/(dashboard)/_components/nav-main"
import {NavGuides} from "@/app/(dashboard)/_components/nav-guides"
import {NavUser} from "@/app/(dashboard)/_components/nav-user"
import {SidebarHeading} from "@/app/(dashboard)/_components/sidebar-heading"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar"
import {SidebarData} from "@/app/(dashboard)/_utils/types";

// Modified data for your project
const data: SidebarData = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: LayoutGrid,
		},
		{
			title: "Market Prediction",
			url: "/group-37",
			icon: Bot,
			items: [
				{
					title: "Price Forecast",
					url: "/forecast",
				},
				{
					title: "Model Metrics",
					url: "/group-37/metrics",
				},
			],
		},
		{
			title: "Budget Tracking",
			url: "/group-38",
			icon: DollarSign,
			items: [
				{
					title: "Categorization",
					url: "/group-38/categorization",
				},
				{
					title: "Budget Analysis",
					url: "/group-38/analysis",
				},
			],
		},
		{
			title: "Portfolio Optimization",
			url: "/group-39",
			icon: PieChart,
			items: [
				{
					title: "Investment Plan",
					url: "/group-39/investment",
				},
				{
					title: "Monte Carlo Sim",
					url: "/group-39/monte-carlo",
				},
				{
					title: "Markowitz Model",
					url: "/group-39/markowitz",
				},
			],
		},
		{
			title: "Risk & Compliance",
			url: "/group-40",
			icon: Scale,
			items: [
				{
					title: "Risk Analysis",
					url: "/group-40/risk",
				},
				{
					title: "Fairness & Bias",
					url: "/group-40/fairness",
				},
				{
					title: "Explainability",
					url: "/group-40/explain",
				},
			],
		},
		{
			title: "Settings",
			url: "/settings",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "/settings/general",
				},
				{
					title: "Team",
					url: "/settings/team",
				},
			],
		},
	],
	guides: [
		{
			name: "ML Model Notebook",
			url: "/notebooks",
			icon: FolderGit2,
		},
		{
			name: "Documentation",
			url: "/docs",
			icon: Users,
		},
	],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarHeading/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain}/>
				<NavGuides projects={data.guides}/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser/>
			</SidebarFooter>
			<SidebarRail/>
		</Sidebar>
	)
}

'use client';

import React from 'react';
import {NavMain} from "@/app/(dashboard)/_components/nav-main";
import {NavGuides} from "@/app/(dashboard)/_components/nav-guides";
import {Role} from "@/lib/types/user";
import {SidebarData} from "@/app/(dashboard)/_utils/types";
import {
    Bot,
    ChartCandlestickIcon,
    DollarSign,
    FolderGit2,
    LayoutGrid,
    PieChart,
    Scale,
    Settings2,
    Users
} from "lucide-react";

const userSidebar: SidebarData = {
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
                    url: "/group-37/forecast",
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
            url: "/portfolio",
            icon: PieChart,
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

const adminSidebar: SidebarData = {
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
                    url: "/group-37/forecast",
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
            url: "/portfolio",
            icon: PieChart,
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
            title: "Stock symbols",
            url: '/stock-symbol',
            icon: ChartCandlestickIcon,
            items: [
                {
                    title: "All symbols",
                    url: "/stock-symbol/all",
                },
                {
                    title: "Risks",
                    url: "/stock-symbol/risk",
                },
                {
                    title: "Blacklist",
                    url: "/stock-symbol/blacklist",
                }
            ]
        },
        {
            title: "Compliance rules",
            url: '/compliance-rules',
            icon: Scale,
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

const AppSidebarLinks = ({role}: { role: Role }) => {
    const sidebar = role === 'admin' ? adminSidebar : userSidebar;
    return (
        <>
            <NavMain items={sidebar.navMain}/>
            <NavGuides projects={sidebar.guides}/>
        </>
    );
};

export default AppSidebarLinks;
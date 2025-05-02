'use client';

import React from 'react';
import {NavMain} from "@/app/(dashboard)/_components/nav-main";
import {NavGuides} from "@/app/(dashboard)/_components/nav-guides";
import {Role} from "@/lib/types/user";
import {SidebarData} from "@/app/(dashboard)/_utils/types";
import {
    ChartCandlestickIcon,
    Earth,
    FolderGit2,
    LayoutGrid,
    PieChart,
    Users
} from "lucide-react";

const userSidebar: SidebarData = {
    navMain: [
        {
            title: "Portfolio Optimization",
            url: "/dashboard/portfolio",
            icon: PieChart,
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
            title: "Global Assets",
            url: '/assets',
            icon: Earth,
            initiallyExpanded: true,
            items: [
                {
                    title: "Discover",
                    url: "/global-assets/lookup",
                },
                {
                    title: "Top Screens",
                    url: "/global-assets/top-screens",
                },
                {
                    title: "Sectors",
                    url: "/global-assets/sectors",
                },

            ]
        },
        {
            title: "System Assets",
            url: '/assets/db',
            icon: ChartCandlestickIcon,
        }
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
"use client"

import * as React from "react"
import { Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import Link from "next/link";

export function SidebarHeading() {
    const { open } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="w-full justify-start"
                >
                    <Link href={'/'} className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Wallet className="size-4" />
                    </Link>

                    {open && (
                        <motion.div
                            className="grid flex-1 text-left ml-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <span className="font-bold text-base">IntelliFinance</span>
                            <span className="text-xs text-muted-foreground">Smart money management</span>
                        </motion.div>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
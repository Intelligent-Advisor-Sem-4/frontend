import React from "react";
import { Wallet } from "lucide-react"
import Image from "next/image";

export default function AuthLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-6">
                <div className="flex justify-start gap-2">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-primary"/>
                        <span className="font-bold text-xl">IntelliFinance</span>
                    </div>
                </div>
                {children}
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image src={'/login-image.jpg'} alt={'Login Image'} fill className="object-cover" />
            </div>
        </div>
    )
}

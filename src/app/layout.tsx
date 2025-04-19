// RootLayout (globals/layout.tsx)
import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import {ToastContainer} from "react-toastify";
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import {ThemeProvider} from "@/components/ThemeProvider";

export const metadata: Metadata = {
    title: "Intelligent Personal Finance Assistant",
    description: "Intelligent Personal Finance Assistant",
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className={'bg-background h-screen w-screen flex'}>
        <div className={'w-full h-full'}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </div>
        <ToastContainer/>
        </body>
        </html>
    );
}
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner"; // ADDED
import "./globals.css";

export const metadata: Metadata = {
    title: "College Management System",
    description: "A modern solution for managing colleges.",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <html lang="en">
        <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
        <Toaster richColors /> {/* ADDED */}
        </body>
        </html>
    );
}
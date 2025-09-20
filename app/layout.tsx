// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
    title: "College Management System",
    description:
        "A comprehensive and modern solution for managing educational institutions, students, staff, and academic operations.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen`}
        >
        {/* ThemeProvider goes inside <body>, but still controls <html> */}
        <ThemeProvider
            attribute="class"        // applies theme class to <html>
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="relative flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
            </div>
            <Toaster
                richColors
                position="top-right"
                expand={true}
                duration={4000}
            />
        </ThemeProvider>
        </body>
        </html>
    );
}

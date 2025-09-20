// app/dashboard/layout.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthService } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [userRole, setUserRole] = useState<"principal" | "hod" | "staff" | "student" | null>(null);

    useEffect(() => {
        // We get the role on the client-side from localStorage
        const role = AuthService.getUserRole() as "principal" | "hod" | "staff" | "student";
        if (role) {
            setUserRole(role);
        } else {
            // If no role is found, redirect to login
            router.push("/login");
        }
    }, [router]);

    // Don't render anything until we've confirmed the user's role
    if (!userRole) {
        return null; // Or a loading spinner
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar userRole={userRole} currentPath={pathname} />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"

export default function HomePage() {
    const router = useRouter()

    useEffect(() => {
        const token = AuthService.getToken();
        const role = AuthService.getUserRole();

        if (token && role) {
            // User is authenticated, redirect to their dashboard
            switch (role.toLowerCase()) {
                case "principal":
                    router.push("/dashboard/principal");
                    break;
                case "hod":
                    router.push("/dashboard/hod");
                    break;
                case "staff":
                    router.push("/dashboard/staff");
                    break;
                case "student":
                    router.push("/dashboard/student");
                    break;
                default:
                    // Fallback to login if role is unknown
                    router.push("/login");
            }
        } else {
            // No token, user must log in
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">College Management System</h1>
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    )
}
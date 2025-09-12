// app/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            // Let the login page handle the conditional routing based on role
            // This ensures the correct dashboard is loaded with up-to-date data
            router.push("/login");
        } else {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">College Management System</h1>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    )
}
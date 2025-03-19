"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Loader2 } from "lucide-react"

type AuthGuardProps = {
    children: React.ReactNode
    allowedRoles?: Array<"PRINCIPAL" | "HOD" | "STAFF" | "STUDENT">
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login")
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                router.push("/dashboard")
            } else {
                setIsAuthorized(true)
            }
        }
    }, [user, isLoading, router, allowedRoles])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return isAuthorized ? <>{children}</> : null
}


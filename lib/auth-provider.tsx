"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

type User = {
    id: string
    email: string
    role: "PRINCIPAL" | "HOD" | "STAFF" | "STUDENT"
    firstName: string
    lastName: string
    collegeName?: string
    department?: string
}

type AuthContextType = {
    user: User | null
    token: string | null
    login: (token: string, userData: Partial<User>) => void // Updated to accept userData
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for token and userId in localStorage on initial load
        const storedToken = localStorage.getItem("token")
        const storedUserId = localStorage.getItem("userId")
        if (storedToken && storedUserId) {
            try {
                const decoded = jwtDecode<{
                    sub: string
                    email: string
                    role: "PRINCIPAL" | "HOD" | "STAFF" | "STUDENT"
                    firstName?: string
                    lastName?: string
                    collegeName?: string
                    department?: string
                }>(storedToken)

                setUser({
                    id: storedUserId, // Use stored userId
                    email: decoded.email || decoded.sub,
                    role: decoded.role,
                    firstName: decoded.firstName || localStorage.getItem("firstName") || "",
                    lastName: decoded.lastName || localStorage.getItem("lastName") || "",
                    collegeName: decoded.collegeName || localStorage.getItem("collegeName") || undefined,
                    department: decoded.department || localStorage.getItem("department") || undefined,
                })
                setToken(storedToken)
            } catch (error) {
                console.error("Invalid token:", error)
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                localStorage.removeItem("firstName")
                localStorage.removeItem("lastName")
                localStorage.removeItem("collegeName")
                localStorage.removeItem("department")
            }
        }
        setIsLoading(false)
    }, [])

    const login = (newToken: string, userData: Partial<User>) => {
        try {
            const decoded = jwtDecode<{
                sub: string
                email: string
                role: "PRINCIPAL" | "HOD" | "STAFF" | "STUDENT"
                firstName?: string
                lastName?: string
                collegeName?: string
                department?: string
            }>(newToken)

            const updatedUser: User = {
                id: userData.id || decoded.sub, // Prefer userData.id (userId from backend) over sub
                email: userData.email || decoded.email || decoded.sub,
                role: decoded.role,
                firstName: userData.firstName || decoded.firstName || "",
                lastName: userData.lastName || decoded.lastName || "",
                collegeName: userData.collegeName || decoded.collegeName,
                department: userData.department || decoded.department,
            }

            setUser(updatedUser)
            setToken(newToken)
            localStorage.setItem("token", newToken)
            localStorage.setItem("userId", updatedUser.id) // Store userId separately
            localStorage.setItem("firstName", updatedUser.firstName)
            localStorage.setItem("lastName", updatedUser.lastName)
            if (updatedUser.collegeName) localStorage.setItem("collegeName", updatedUser.collegeName)
            if (updatedUser.department) localStorage.setItem("department", updatedUser.department)

            // Redirect based on role
            router.push("/dashboard")
        } catch (error) {
            console.error("Login error:", error)
            toast.error("Login failed", {
                description: "Invalid token received. Please try again.",
                duration: 5000,
            })
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        localStorage.removeItem("collegeName")
        localStorage.removeItem("department")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
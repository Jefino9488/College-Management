// src/components/auth/login-form.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { AuthService } from "@/lib/auth"
import { ApiService } from "@/lib/api"
import { toast } from "sonner"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("") // Kept for potential non-API errors if needed
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await AuthService.login(email, password)
            const profileStatus = await ApiService.getProfileStatus();

            if (profileStatus.role === 'PRINCIPAL' && !profileStatus.collegeId) {
                router.push('/onboarding/create-college');
                return;
            }

            switch (profileStatus.role.toLowerCase()) {
                case "principal":
                    router.push("/dashboard/principal")
                    break
                case "hod":
                    router.push("/dashboard/hod")
                    break
                case "staff":
                    router.push("/dashboard/staff")
                    break
                case "student":
                    router.push("/dashboard/student")
                    break
                default:
                    router.push("/login")
            }
        } catch (err: any) {
            // MODIFIED: Use toast for specific error feedback
            toast.error("Login Failed", {
                description: err.message,
            });
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up">
            <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">C</span>
                    </div>
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        College Management System
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        Sign in to your account to continue
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* The error state can be removed if only toasts are used */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email address"
                            className="h-11 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="h-11 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                            disabled={loading}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 font-medium bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                        disabled={loading || !email || !password}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-foreground/70">
                        Don't have an account?{" "}
                        <Button variant="link" className="p-0" onClick={() => router.push("/register")}>
                            Register here
                        </Button>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
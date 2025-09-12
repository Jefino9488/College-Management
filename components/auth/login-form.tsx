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

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
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
        } catch (err) {
            setError("Invalid email or password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">College Management System</CardTitle>
                <CardDescription className="text-foreground/70">Sign in to your account</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
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
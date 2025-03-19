"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { authApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Toaster, toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [rememberMe, setRememberMe] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authApi.login(email, password)
            const { jwtToken, userId, firstName, lastName, email: responseEmail, department, collegeName } = response.data

            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email)
            } else {
                localStorage.removeItem("rememberedEmail")
            }

            login(jwtToken, {
                id: String(userId), // Convert to string
                email: responseEmail,
                firstName,
                lastName,
                department,
                collegeName,
            })

            toast.success("Login successful", {
                description: "Welcome back!",
                duration: 3000,
            })

            router.push("/dashboard")
        } catch (error: any) {
            console.error("Login error:", error)
            const errorMessage = error.response?.data?.errorMessage || "Invalid credentials. Please try again."
            toast.error("Login failed", {
                description: errorMessage,
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail")
        if (rememberedEmail) {
            setEmail(rememberedEmail)
            setRememberMe(true)
        }
    }, [])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked === true)}
                                disabled={isLoading}
                            />
                            <Label htmlFor="remember" className="text-sm">
                                Remember me
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
            <Toaster position="top-right" richColors />
        </div>
    )
}
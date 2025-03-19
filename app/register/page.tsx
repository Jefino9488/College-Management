"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authApi, collegeApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

type College = {
    id: string
    name: string
}

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [activationCode, setActivationCode] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gender, setGender] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [role, setRole] = useState("")
    const [collegeId, setCollegeId] = useState("")
    const [department, setDepartment] = useState("")
    const [academicYear, setAcademicYear] = useState("")
    const [colleges, setColleges] = useState<College[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCodeSent, setIsCodeSent] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await collegeApi.getAllColleges()
                setColleges(response.data)
            } catch (error) {
                console.error("Error fetching colleges:", error)
                toast({
                    title: "Error",
                    description: "Failed to load colleges. Please try again later.",
                    variant: "destructive",
                })
            }
        }

        fetchColleges()
    }, [toast])

    const handleSendActivationCode = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email address.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            await authApi.validateEmail(email)
            setIsCodeSent(true)
            toast({
                title: "Success",
                description: "Activation code sent to your email.",
            })
        } catch (error: any) {
            console.error("Error sending activation code:", error)
            toast({
                title: "Error",
                description: error.response?.data?.errorMessage || "Failed to send activation code. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNextStep = () => {
        if (!email || !isCodeSent) {
            toast({
                title: "Error",
                description: "Please enter your email and request an activation code.",
                variant: "destructive",
            })
            return
        }

        setStep(2)
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        const registrationData = {
            email,
            password,
            firstName,
            lastName,
            gender,
            mobileNumber,
            role,
            collegeId,
            department: role !== "PRINCIPAL" ? department : undefined,
            academicYear: role === "STUDENT" ? academicYear : undefined,
            activationCode,
        }

        try {
            await authApi.register(registrationData)

            toast({
                title: "Registration successful",
                description: "You can now login with your credentials.",
            })

            router.push("/login")
        } catch (error: any) {
            console.error("Registration error:", error)

            toast({
                title: "Registration failed",
                description:
                    error.response?.data?.errorMessage || "Failed to register. Please check your information and try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                    <CardDescription>
                        {step === 1 ? "Enter your email to get started" : "Complete your registration"}
                    </CardDescription>
                </CardHeader>
                {step === 1 ? (
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
                            />
                        </div>
                        <Button type="button" onClick={handleSendActivationCode} disabled={isLoading || !email} className="w-full">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : isCodeSent ? (
                                "Resend Activation Code"
                            ) : (
                                "Send Activation Code"
                            )}
                        </Button>
                        {isCodeSent && (
                            <div className="space-y-2">
                                <Label htmlFor="activationCode">Activation Code</Label>
                                <Input
                                    id="activationCode"
                                    type="text"
                                    placeholder="Enter the code sent to your email"
                                    value={activationCode}
                                    onChange={(e) => setActivationCode(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </CardContent>
                ) : (
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="college">College</Label>
                                <Select value={collegeId} onValueChange={setCollegeId} required>
                                    <SelectTrigger id="college">
                                        <SelectValue placeholder="Select a college" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colleges.map((college) => (
                                            <SelectItem key={college.id} value={college.id}>
                                                {college.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role} onValueChange={setRole} required>
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PRINCIPAL">Principal</SelectItem>
                                        <SelectItem value="HOD">Head of Department</SelectItem>
                                        <SelectItem value="STAFF">Staff</SelectItem>
                                        <SelectItem value="STUDENT">Student</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {role !== "PRINCIPAL" && (
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department Code</Label>
                                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                                </div>
                            )}

                            {role === "STUDENT" && (
                                <div className="space-y-2">
                                    <Label htmlFor="academicYear">Academic Year</Label>
                                    <Input
                                        id="academicYear"
                                        value={academicYear}
                                        onChange={(e) => setAcademicYear(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={gender} onValueChange={setGender} required>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select your gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mobileNumber">Mobile Number</Label>
                                <Input
                                    id="mobileNumber"
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} disabled className="bg-muted" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="activationCode">Activation Code</Label>
                                <Input
                                    id="activationCode"
                                    type="text"
                                    value={activationCode}
                                    onChange={(e) => setActivationCode(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                )}
                <CardFooter className="flex flex-col space-y-4">
                    {step === 1 && (
                        <Button type="button" onClick={handleNextStep} disabled={!isCodeSent || !activationCode} className="w-full">
                            Next
                        </Button>
                    )}
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}


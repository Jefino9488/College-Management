// src/components/auth/register-form.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { AuthService } from "@/lib/auth"
import { ApiService } from "@/lib/api"

export function RegisterForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        academicYear: "",
        collegeId: "",
        code: "",
    })
    const [colleges, setColleges] = useState([])
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const fetchedColleges = await ApiService.getAllColleges();
                setColleges(fetchedColleges);
            } catch (err) {
                console.error("Failed to fetch colleges:", err);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (formData.collegeId) {
            const fetchDepartments = async () => {
                try {
                    const fetchedDepartments = await ApiService.getDepartmentsByCollege(parseInt(formData.collegeId));
                    setDepartments(fetchedDepartments);
                } catch (err) {
                    console.error("Failed to fetch departments:", err);
                }
            };
            fetchDepartments();
        } else {
            setDepartments([]);
        }
    }, [formData.collegeId]);


    const handleEmailValidation = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.role) {
            setError("Please select a role.");
            setLoading(false);
            return;
        }

        if (formData.role !== 'principal' && !formData.collegeId) {
            setError("Please select a college.");
            setLoading(false);
            return;
        }

        if (formData.role !== 'principal' && !formData.department) {
            setError("Please select a department.");
            setLoading(false);
            return;
        }

        try {
            await AuthService.validateEmail(formData.email);
            setStep(2);
        } catch (err) {
            setError("Failed to validate email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const authResponse = await AuthService.verifyAndRegister({
                ...formData,
                collegeId: formData.collegeId ? parseInt(formData.collegeId) : null,
            });

            const userRole = authResponse.user.role.toLowerCase();
            switch (userRole) {
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
                    router.push("/dashboard");
            }
        } catch (err: any) {
            const errorMessage = err.message || "Registration failed. Please check your verification code.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-foreground/70">
                    {step === 1 ? "Enter your details to get started" : "Enter the verification code sent to your email"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === 1 ? (
                    <form onSubmit={handleEmailValidation} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobileNumber">Mobile Number</Label>
                                <Input
                                    id="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    required
                                    placeholder="Enter mobile number"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="principal">Principal</SelectItem>
                                    <SelectItem value="hod">Head of Department</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.role !== 'principal' && (
                            <div className="space-y-2">
                                <Label htmlFor="college">College</Label>
                                <Select
                                    value={formData.collegeId}
                                    onValueChange={(value) => setFormData({ ...formData, collegeId: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your college" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colleges.map((college: any) => (
                                            <SelectItem key={college.id} value={college.id.toString()}>
                                                {college.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {(formData.role === 'hod' || formData.role === 'staff' || formData.role === 'student') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                                        required
                                        disabled={!formData.collegeId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept: any) => (
                                                <SelectItem key={dept.id} value={dept.code}>
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="academicYear">Academic Year</Label>
                                    <Input
                                        id="academicYear"
                                        value={formData.academicYear}
                                        onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                        placeholder="e.g., 2024"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Create a password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Validating..." : "Continue"}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleRegistration} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                                placeholder="Enter verification code"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                        <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => setStep(1)}>
                            Back
                        </Button>
                    </form>
                )}
                <div className="mt-4 text-center">
                    <p className="text-sm text-foreground/70">
                        Already have an account?{" "}
                        <Button variant="link" className="p-0" onClick={() => router.push("/login")}>
                            Sign in here
                        </Button>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
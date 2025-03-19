"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { collegeApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Building, Loader2, Mail, MapPin, Phone, Plus } from "lucide-react"

export default function CollegeManagementPage() {
    return (
        <AuthGuard allowedRoles={["PRINCIPAL"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <CollegeManagementContent />
                </div>
            </div>
        </AuthGuard>
    )
}

interface College {
    id: string;
    name: string;
    address: string;
    contactEmail: string;
    phoneNumber: string;
    departmentCount: number;
    staffCount: number;
    studentCount: number;
}

function CollegeManagementContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [colleges, setColleges] = useState<College[]>([])
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
    const [newCollege, setNewCollege] = useState({
        name: "",
        address: "",
        contactEmail: "",
        phoneNumber: "",
    })

    useEffect(() => {
        const fetchColleges = async () => {
            setIsLoading(true)
            try {
                const response = await collegeApi.getAllColleges()
                setColleges(response || [])
                toast.success("Colleges loaded successfully")
            } catch (error) {
                console.error("Error fetching colleges:", error)
                toast.error("Failed to load colleges. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchColleges()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewCollege((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRegisterCollege = async () => {
        if (!newCollege.name || !newCollege.address || !newCollege.contactEmail || !newCollege.phoneNumber) {
            toast.error("Please fill in all required fields.")
            return
        }

        try {
            const response = await collegeApi.registerCollege(newCollege)
            const registeredCollege = {
                id: response.id || `college-${Date.now()}`, // Use backend ID if provided
                ...newCollege,
                departmentCount: 0,
                staffCount: 0,
                studentCount: 0,
            }

            setColleges((prev) => [...prev, registeredCollege])
            setIsRegisterDialogOpen(false)
            setNewCollege({
                name: "",
                address: "",
                contactEmail: "",
                phoneNumber: "",
            })
            toast.success("College registered successfully")
        } catch (error) {
            console.error("Error registering college:", error)
            toast.error("Failed to register college. Please try again.")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">College Management</h1>
                <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Register College
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Register New College</DialogTitle>
                            <DialogDescription>Enter the details of the new college.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">College Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={newCollege.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Example University"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={newCollege.address}
                                    onChange={handleInputChange}
                                    placeholder="Full address of the college"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={newCollege.contactEmail}
                                    onChange={handleInputChange}
                                    placeholder="e.g., info@example.edu"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={newCollege.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="e.g., +1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleRegisterCollege}>Register College</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : colleges.length > 0 ? (
                <div className="space-y-6">
                    {colleges.map((college) => (
                        <Card key={college.id}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{college.name}</CardTitle>
                                <CardDescription>College Information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-medium">Address</h3>
                                                <p className="text-sm text-muted-foreground">{college.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-medium">Contact Email</h3>
                                                <p className="text-sm text-muted-foreground">{college.contactEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <h3 className="font-medium">Phone Number</h3>
                                                <p className="text-sm text-muted-foreground">{college.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Card className="bg-primary/5">
                                            <CardContent className="p-4 text-center">
                                                <Building className="mx-auto mb-2 h-8 w-8 text-primary" />
                                                <h3 className="text-sm font-medium">Departments</h3>
                                                <p className="text-2xl font-bold">{college.departmentCount}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-primary/5">
                                            <CardContent className="p-4 text-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="mx-auto mb-2 h-8 w-8 text-primary"
                                                >
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                <h3 className="text-sm font-medium">Staff</h3>
                                                <p className="text-2xl font-bold">{college.staffCount}</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-primary/5">
                                            <CardContent className="p-4 text-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="mx-auto mb-2 h-8 w-8 text-primary"
                                                >
                                                    <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-2" />
                                                    <path d="M18 8h4v4h-4z" />
                                                    <path d="m15 8-7 7" />
                                                    <path d="m8 8 7 7" />
                                                </svg>
                                                <h3 className="text-sm font-medium">Students</h3>
                                                <p className="text-2xl font-bold">{college.studentCount}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button variant="outline">Edit College Information</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex h-32 flex-col items-center justify-center">
                        <p className="text-center text-muted-foreground">
                            No colleges found. Register a college to get started.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { staffApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner" // Using Sonner
import { Loader2, Plus, Search } from "lucide-react"

export default function StaffPage() {
    return (
        <AuthGuard allowedRoles={["PRINCIPAL", "HOD"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <StaffContent />
                </div>
                <Toaster position="top-right" richColors />
            </div>
        </AuthGuard>
    )
}

function StaffContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [staff, setStaff] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [newStaff, setNewStaff] = useState({
        firstName: "",
        lastName: "",
        email: "",
        department: user?.department || "",
    })

    useEffect(() => {
        const fetchStaff = async () => {
            if (!user?.id) return

            setIsLoading(true)
            try {
                let response
                if (user.role === "PRINCIPAL") {
                    // Hypothetical endpoint for PRINCIPAL to fetch all staff in college
                    response = await staffApi.getAllStaff(user.id) // Assuming user.id is collegeId
                } else if (user.role === "HOD") {
                    // Fetch staff for HOD’s department
                    response = await staffApi.getStaffByDepartment(user.department || "")
                }
                setStaff(response.data || [])
            } catch (error: any) {
                console.error("Error fetching staff:", error)
                toast.error("Error", {
                    description: error.response?.data?.message || "Failed to load staff data. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchStaff()
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewStaff((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddStaff = async () => {
        if (!user?.id) return

        setIsLoading(true)
        try {
            const response = await staffApi.addStaff({
                collegeId: user.role === "PRINCIPAL" ? user.id : undefined,
                department: user.role === "HOD" ? user.department : newStaff.department,
                firstName: newStaff.firstName,
                lastName: newStaff.lastName,
                email: newStaff.email,
                role: "STAFF",
            })

            const addedStaff = response.data
            setStaff((prev) => [...prev, addedStaff])
            setNewStaff({ firstName: "", lastName: "", email: "", department: user?.department || "" })
            setIsAddDialogOpen(false)

            toast.success("Success", {
                description: "Staff member added successfully.",
                duration: 3000,
            })
        } catch (error: any) {
            console.error("Error adding staff:", error)
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to add staff member. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filteredStaff = staff.filter(
        (member) =>
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search staff..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Staff Member</DialogTitle>
                                <DialogDescription>Add a new staff member to your team.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={newStaff.firstName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={newStaff.lastName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={newStaff.email}
                                        onChange={handleInputChange}
                                        placeholder="e.g., john.doe@example.com"
                                    />
                                </div>
                                {user?.role === "PRINCIPAL" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            value={newStaff.department}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddStaff} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Staff"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff Members</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredStaff.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Subjects</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStaff.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                {member.firstName} {member.lastName}
                                            </TableCell>
                                            <TableCell>{member.email}</TableCell>
                                            <TableCell>{member.department || "N/A"}</TableCell>
                                            <TableCell>{member.subjects?.join(", ") || "None assigned"}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-32 flex-col items-center justify-center">
                            <p className="text-center text-muted-foreground">
                                {searchQuery ? "No staff members match your search." : "No staff members found."}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { departmentApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

export default function DepartmentsPage() {
    return (
        <AuthGuard allowedRoles={["PRINCIPAL"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <DepartmentsContent />
                </div>
                <Toaster position="top-right" richColors />
            </div>
        </AuthGuard>
    )
}

function DepartmentsContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [departments, setDepartments] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
    const [newDepartment, setNewDepartment] = useState({
        name: "",
        code: "",
        description: "",
        totalYears: 4, // Default value, adjust as needed
        semestersPerYear: 2, // Default value, adjust as needed
    })

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!user?.id) return

            setIsLoading(true)
            try {
                // Adjust to match your endpoint: /college-manager/department?collegeId={collegeId}
                const response = await departmentApi.getDepartmentsByCollege(user.id)
                setDepartments(response.data || [])
            } catch (error: any) {
                console.error("Error fetching departments:", error)
                toast.error("Error", {
                    description: error.response?.data?.message || "Failed to load departments. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchDepartments()
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddDepartment = async () => {
        if (!user?.id) return

        setIsLoading(true)
        try {
            const response = await departmentApi.addDepartment({
                collegeId: user.id, // user.id is the collegeId for PRINCIPAL
                name: newDepartment.name,
                code: newDepartment.code,
                description: newDepartment.description,
                totalYears: newDepartment.totalYears,
                semestersPerYear: newDepartment.semestersPerYear,
            })

            const addedDept = response.data
            setDepartments((prev) => [...prev, addedDept])
            setNewDepartment({ name: "", code: "", description: "", totalYears: 4, semestersPerYear: 2 })
            setIsAddDialogOpen(false)

            toast.success("Success", {
                description: "Department added successfully.",
                duration: 3000,
            })
        } catch (error: any) {
            console.error("Error adding department:", error)
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to add department. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search departments..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Department
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Department</DialogTitle>
                                <DialogDescription>Create a new department for your college.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Department Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={newDepartment.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Department Code</Label>
                                    <Input
                                        id="code"
                                        name="code"
                                        value={newDepartment.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g., CS"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={newDepartment.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of the department"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalYears">Total Years</Label>
                                    <Input
                                        id="totalYears"
                                        name="totalYears"
                                        type="number"
                                        value={newDepartment.totalYears}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 4"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semestersPerYear">Semesters Per Year</Label>
                                    <Input
                                        id="semestersPerYear"
                                        name="semestersPerYear"
                                        type="number"
                                        value={newDepartment.semestersPerYear}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 2"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddDepartment} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Department"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading && departments.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredDepartments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDepartments.map((dept) => (
                        <Card key={dept.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {dept.name}
                                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                        {dept.code}
                                    </span>
                                </CardTitle>
                                <CardDescription>{dept.description || "No description available"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">HOD:</span>
                                        <span>{dept.hod?.firstName || "Not assigned"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Staff:</span>
                                        <span>{dept.staffCount || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Students:</span>
                                        <span>{dept.studentCount || 0}</span>
                                    </div>
                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex h-32 flex-col items-center justify-center">
                        <p className="text-center text-muted-foreground">
                            {searchQuery
                                ? "No departments match your search."
                                : "No departments found. Add a department to get started."}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
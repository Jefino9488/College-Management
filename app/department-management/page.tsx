"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { departmentApi } from "@/lib/api"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Plus, Search } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function DepartmentManagementPage() {
    return (
        <AuthGuard allowedRoles={["PRINCIPAL"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <DepartmentManagementContent />
                </div>
            </div>
        </AuthGuard>
    )
}

interface Department {
    id: number;
    code: string;
    name: string;
    description: string;
    totalYears: number;
    semestersPerYear: number;
    collegeId: number;
    hod?: { id: number; firstName: string; lastName: string } | null;
    staffCount?: number; // Not in backend entity, assuming aggregated elsewhere
    studentCount?: number; // Not in backend entity, assuming aggregated elsewhere
}

interface Hod {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

function DepartmentManagementContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [departments, setDepartments] = useState<Department[]>([])
    const [hods, setHods] = useState<Hod[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isAssignHodDialogOpen, setIsAssignHodDialogOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
    const [newDepartment, setNewDepartment] = useState({
        code: "",
        name: "",
        description: "",
        totalYears: "",
        semestersPerYear: "",
        collegeId: user?.collegeId?.toString() || "",
    })
    const [hodAssignment, setHodAssignment] = useState({
        departmentId: "",
        hodId: "",
    })

    const itemsPerPage = 6

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!user?.collegeId) return;

            setIsLoading(true)
            try {
                const response = await departmentApi.getAllDepartments(user.collegeId)
                setDepartments(response || [])
                toast.success("Departments loaded successfully")
            } catch (error) {
                console.error("Error fetching departments:", error)
                toast.error("Failed to load departments. Please try again.")
            } finally {
                setIsLoading(false)
            }
        }

        const fetchHods = async () => {
            try {
                const response = await departmentApi.getHods()
                setHods(response || [])
                toast.success("HODs loaded successfully")
            } catch (error) {
                console.error("Error fetching HODs:", error)
                toast.error("Failed to load HODs. Please try again.")
            }
        }

        fetchDepartments()
        fetchHods()
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewDepartment((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleAddDepartment = async () => {
        if (!newDepartment.code || !newDepartment.name || !newDepartment.totalYears || !newDepartment.semestersPerYear || !newDepartment.collegeId) {
            toast.error("Please fill in all required fields.")
            return
        }

        const departmentPayload = {
            code: newDepartment.code,
            name: newDepartment.name,
            description: newDepartment.description,
            totalYears: parseInt(newDepartment.totalYears, 10),
            semestersPerYear: parseInt(newDepartment.semestersPerYear, 10),
            collegeId: parseInt(newDepartment.collegeId, 10),
        }

        try {
            const response = await departmentApi.addDepartment(departmentPayload)
            const addedDepartment = {
                ...response,
                staffCount: 0,
                studentCount: 0,
            }

            setDepartments((prev) => [...prev, addedDepartment])
            setIsAddDialogOpen(false)
            setNewDepartment({
                code: "",
                name: "",
                description: "",
                totalYears: "",
                semestersPerYear: "",
                collegeId: user?.collegeId?.toString() || "",
            })
            toast.success("Department added successfully")
        } catch (error) {
            console.error("Error adding department:", error)
            toast.error("Failed to add department. Please try again.")
        }
    }

    const handleAssignHod = async () => {
        if (!hodAssignment.departmentId || !hodAssignment.hodId) {
            toast.error("Please select both department and HOD.")
            return
        }

        try {
            const response = await departmentApi.assignHod(
                parseInt(hodAssignment.departmentId, 10),
                parseInt(hodAssignment.hodId, 10),
            )
            const updatedDepartment = response

            setDepartments((prev) =>
                prev.map((dept) =>
                    dept.id === updatedDepartment.id ? updatedDepartment : dept,
                ),
            )
            setIsAssignHodDialogOpen(false)
            setHodAssignment({ departmentId: "", hodId: "" })
            toast.success("HOD assigned successfully")
        } catch (error) {
            console.error("Error assigning HOD:", error)
            toast.error("Failed to assign HOD. Please try again.")
        }
    }

    const filteredDepartments = departments.filter(
        (dept) =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.code.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage)
    const paginatedDepartments = filteredDepartments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
                <div className="flex flex-col gap-4 sm:flex-row">
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
                    <div className="flex gap-2">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Department
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Department</DialogTitle>
                                    <DialogDescription>Create a new department for your college.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
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
                                            <Label htmlFor="name">Department Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={newDepartment.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Computer Science"
                                            />
                                        </div>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="totalYears">Total Years</Label>
                                            <Input
                                                id="totalYears"
                                                name="totalYears"
                                                type="number"
                                                min="1"
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
                                                min="1"
                                                max="3"
                                                value={newDepartment.semestersPerYear}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddDepartment}>Add Department</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isAssignHodDialogOpen} onOpenChange={setIsAssignHodDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Assign HOD</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Assign Head of Department</DialogTitle>
                                    <DialogDescription>Assign a HOD to a department.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="departmentId">Department</Label>
                                        <Select
                                            value={hodAssignment.departmentId}
                                            onValueChange={(value) =>
                                                setHodAssignment((prev) => ({ ...prev, departmentId: value }))
                                            }
                                        >
                                            <SelectTrigger id="departmentId">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name} ({dept.code})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hodId">Head of Department</Label>
                                        <Select
                                            value={hodAssignment.hodId}
                                            onValueChange={(value) =>
                                                setHodAssignment((prev) => ({ ...prev, hodId: value }))
                                            }
                                        >
                                            <SelectTrigger id="hodId">
                                                <SelectValue placeholder="Select HOD" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hods.map((hod) => (
                                                    <SelectItem key={hod.id} value={hod.id.toString()}>
                                                        {hod.firstName} {hod.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAssignHodDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAssignHod}>Assign HOD</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : paginatedDepartments.length > 0 ? (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedDepartments.map((dept) => (
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
                                            <span>{dept.hod ? `${dept.hod.firstName} ${dept.hod.lastName}` : "Not assigned"}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Staff:</span>
                                            <span>{dept.staffCount || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Students:</span>
                                            <span>{dept.staffCount || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Duration:</span>
                                            <span>
                                                {dept.totalYears} years ({dept.totalYears * dept.semestersPerYear} semesters)
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDepartment(dept.id.toString())
                                            setHodAssignment((prev) => ({ ...prev, departmentId: dept.id.toString() }))
                                            setIsAssignHodDialogOpen(true)
                                        }}
                                    >
                                        {dept.hod ? "Change HOD" : "Assign HOD"}
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNumber = i + 1
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(pageNumber)}
                                                isActive={currentPage === pageNumber}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <PaginationItem>
                                            <span className="px-2">...</span>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink
                                                onClick={() => setCurrentPage(totalPages)}
                                                isActive={currentPage === totalPages}
                                            >
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </>
                                )}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
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
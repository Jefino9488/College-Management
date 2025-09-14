"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Mail, Phone } from "lucide-react"
import { ApiService } from "@/lib/api"

interface StaffMember {
    id: string
    firstName: string
    lastName: string
    personalEmail: string
    mobileNumber?: string
    role: "STAFF" | "HOD"
    department?: {
        name: string
    }
}

export function StaffManagement() {
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState("all")

    useEffect(() => {
        loadStaffData()
    }, [])

    const loadStaffData = async () => {
        setLoading(true)
        try {
            // In a real app, get the principal's college ID from their profile/auth context
            const collegeId = "1" // Placeholder
            const data = await ApiService.getStaffByCollege(collegeId)
            setStaff(data)
        } catch (error) {
            console.error("Failed to load staff data:", error)
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
    }

    const filteredStaff = staff
        .filter(member => {
            const fullName = `${member.firstName} ${member.lastName}`.toLowerCase()
            const search = searchTerm.toLowerCase()
            return (
                fullName.includes(search) ||
                (member.personalEmail && member.personalEmail.toLowerCase().includes(search)) ||
                (member.department && member.department.name.toLowerCase().includes(search))
            )
        })
        .filter(member => selectedRole === "all" || member.role.toLowerCase() === selectedRole)

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>College Staff & HODs</CardTitle>
                            <CardDescription>A complete list of all teaching and department head staff.</CardDescription>
                        </div>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Staff
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, or department..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="hod">HOD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        {loading ? (
                            <p>Loading staff...</p>
                        ) : filteredStaff.length > 0 ? (
                            filteredStaff.map(member => (
                                <Card key={member.id}>
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`/placeholder.svg`} />
                                                <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold">{`${member.firstName} ${member.lastName}`}</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {member.personalEmail || "No email"}
                                                </p>
                                                {member.mobileNumber && (
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {member.mobileNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={member.role === "HOD" ? "default" : "secondary"}>
                                                {member.role}
                                            </Badge>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {member.department?.name || "No Department"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No staff found matching your criteria.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
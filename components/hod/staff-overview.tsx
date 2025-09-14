"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Mail, Phone, BookOpen } from "lucide-react"
import { ApiService } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "../ui/skeleton"

interface StaffMember {
    id: string
    name: string
    email: string
    phone?: string
    specialization: string
    status: "active" | "inactive"
}

export function StaffOverview() {
    const [staff, setStaff] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStaff = async () => {
            try {
                const staffData = await ApiService.getHodStaff();
                setStaff(staffData);
            } catch (error: any) {
                toast.error("Failed to load staff data", { description: error.message });
            } finally {
                setLoading(false)
            }
        }
        loadStaff()
    }, [])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}><CardContent className="p-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent></Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Department Staff
                    </CardTitle>
                    <CardDescription>Overview of all staff members in your department</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {staff.map((member) => (
                            <Card key={member.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={`/placeholder.svg`} />
                                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{member.name}</h3>
                                                <p className="text-sm text-muted-foreground">{member.specialization}</p>
                                            </div>
                                            <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            {member.phone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>{member.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                View Profile
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1">
                                                Contact
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
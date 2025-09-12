"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Mail, Phone, BookOpen } from "lucide-react"

interface StaffMember {
  id: string
  name: string
  email: string
  phone?: string
  specialization: string
  subjects: string[]
  experience: string
  status: "active" | "inactive"
}

export function StaffOverview() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    try {
      // Mock data for demonstration
      setStaff([
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@college.edu",
          phone: "+1 234-567-8901",
          specialization: "Computer Science",
          subjects: ["Data Structures", "Algorithms", "Programming"],
          experience: "8 years",
          status: "active",
        },
        {
          id: "2",
          name: "Prof. Michael Smith",
          email: "michael.smith@college.edu",
          phone: "+1 234-567-8902",
          specialization: "Database Systems",
          subjects: ["DBMS", "SQL", "Data Mining"],
          experience: "12 years",
          status: "active",
        },
        {
          id: "3",
          name: "Dr. Emily Davis",
          email: "emily.davis@college.edu",
          specialization: "Software Engineering",
          subjects: ["Software Design", "Testing", "Project Management"],
          experience: "6 years",
          status: "active",
        },
      ])
    } catch (error) {
      console.error("Failed to load staff:", error)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
                    {/* Header with Avatar */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/abstract-geometric-shapes.png?height=48&width=48&query=${member.name}`} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.specialization}</p>
                      </div>
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                    </div>

                    {/* Contact Info */}
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

                    {/* Subjects */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Subjects</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {member.subjects.slice(0, 3).map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {member.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="text-sm">
                      <span className="font-medium">Experience:</span> {member.experience}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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

"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Search, Mail, Phone, Building2 } from "lucide-react"
import { ApiService } from "@/lib/api"

interface HOD {
  id: string
  name: string
  email: string
  phone: string
  department: string
  college: string
  assignedDate: string
  status: "active" | "inactive"
}

interface Department {
  id: string
  name: string
  collegeId: string
  collegeName: string
  hasHOD: boolean
}

export default function HODManagementPage() {
  const [hods, setHods] = useState<HOD[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [hodsData, collegesData] = await Promise.all([ApiService.getAllHODs(), ApiService.getAllColleges()])

      setHods(hodsData)
      setColleges(collegesData)

      // Load departments for all colleges
      const allDepartments = []
      for (const college of collegesData) {
        const depts = await ApiService.getDepartments(college.id)
        allDepartments.push(
          ...depts.map((dept: any) => ({
            ...dept,
            collegeName: college.name,
          })),
        )
      }
      setDepartments(allDepartments)
    } catch (error) {
      console.error("Failed to load HOD management data:", error)
    } finally {
      setLoading(false)
    }
  }

    const filteredHods = hods
        .filter(
            (hod) =>
                (hod.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (hod.department?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (hod.college?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
        )
        .filter((hod) => selectedCollege === "all" || hod.college === selectedCollege)


    const unassignedDepartments = departments.filter((dept) => !dept.hasHOD)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="principal" currentPath="/dashboard/principal/hods" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">HOD Management</h1>
              <p className="text-muted-foreground">Manage department heads and assignments across all colleges</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Assign New HOD
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search HODs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCollege} onValueChange={setSelectedCollege}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.name}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total HODs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hods.length}</div>
                <p className="text-xs text-muted-foreground">Active department heads</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unassigned Departments</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unassignedDepartments.length}</div>
                <p className="text-xs text-muted-foreground">Need HOD assignment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Colleges</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{colleges.length}</div>
                <p className="text-xs text-muted-foreground">Registered institutions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coverage Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departments.length > 0
                    ? Math.round(((departments.length - unassignedDepartments.length) / departments.length) * 100)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Departments with HODs</p>
              </CardContent>
            </Card>
          </div>

          {/* HODs List */}
          <Card>
            <CardHeader>
              <CardTitle>Current HODs</CardTitle>
              <CardDescription>List of all department heads and their assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHods.map((hod) => (
                  <div key={hod.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{hod.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {hod.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {hod.phone}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={hod.status === "active" ? "default" : "secondary"}>{hod.status}</Badge>
                      </div>
                      <p className="text-sm font-medium">{hod.department}</p>
                      <p className="text-xs text-muted-foreground">{hod.college}</p>
                      <p className="text-xs text-muted-foreground">Since {hod.assignedDate}</p>
                    </div>
                  </div>
                ))}
                {filteredHods.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No HODs found matching your criteria</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Unassigned Departments */}
          {unassignedDepartments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Departments Without HODs</CardTitle>
                <CardDescription>These departments need HOD assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {unassignedDepartments.map((dept) => (
                    <div key={dept.id} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground">{dept.collegeName}</p>
                      <Button size="sm" className="mt-2 w-full">
                        Assign HOD
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

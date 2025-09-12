"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Users, Search, Plus } from "lucide-react"

interface Student {
  id: string
  name: string
  rollNumber: string
  email: string
  department: string
  academicYear: string
  semester: string
  gpa: number
  attendance: number
  status: "active" | "inactive"
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedDepartment, selectedYear])

  const loadStudents = async () => {
    try {
      // Mock data for demonstration
      setStudents([
        {
          id: "1",
          name: "Alice Johnson",
          rollNumber: "CS2024001",
          email: "alice.johnson@student.edu",
          department: "Computer Science",
          academicYear: "2024",
          semester: "1",
          gpa: 3.8,
          attendance: 92,
          status: "active",
        },
        {
          id: "2",
          name: "Bob Smith",
          rollNumber: "CS2024002",
          email: "bob.smith@student.edu",
          department: "Computer Science",
          academicYear: "2024",
          semester: "1",
          gpa: 3.2,
          attendance: 78,
          status: "active",
        },
        {
          id: "3",
          name: "Carol Davis",
          rollNumber: "CS2023015",
          email: "carol.davis@student.edu",
          department: "Computer Science",
          academicYear: "2023",
          semester: "2",
          gpa: 2.8,
          attendance: 65,
          status: "active",
        },
        {
          id: "4",
          name: "David Wilson",
          rollNumber: "CS2024003",
          email: "david.wilson@student.edu",
          department: "Computer Science",
          academicYear: "2024",
          semester: "1",
          gpa: 3.5,
          attendance: 88,
          status: "active",
        },
      ])
    } catch (err) {
      setError("Failed to load students")
    }
  }

  const filterStudents = () => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((student) => student.department === selectedDepartment)
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((student) => student.academicYear === selectedYear)
    }

    setFilteredStudents(filtered)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError("")

    try {
      // In a real implementation, you would upload the file to the API
      // await ApiService.addStudents(file)
      console.log("Uploading file:", file.name)
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      loadStudents()
    } catch (err) {
      setError("Failed to upload student data")
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

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 85) return "text-green-600"
    if (attendance >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>Manage students, upload data, and track performance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Student Data</DialogTitle>
                    <DialogDescription>Upload an Excel file with student information</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file-upload">Select Excel File</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        disabled={loading}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>File should contain columns: Name, Roll Number, Email, Department, Academic Year</p>
                    </div>
                    {loading && <p className="text-sm text-blue-600">Uploading...</p>}
                  </div>
                </DialogContent>
              </Dialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/abstract-geometric-shapes.png?height=48&width=48&query=${student.name}`} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">{student.department}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Year</p>
                        <p className="text-sm text-muted-foreground">{student.academicYear}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">GPA</p>
                        <p className={`text-sm font-bold ${getGPAColor(student.gpa)}`}>{student.gpa}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Attendance</p>
                        <p className={`text-sm font-bold ${getAttendanceColor(student.attendance)}`}>
                          {student.attendance}%
                        </p>
                      </div>
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
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

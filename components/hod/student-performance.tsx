"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Award, AlertCircle } from "lucide-react"

interface StudentPerformance {
  id: string
  name: string
  rollNumber: string
  year: string
  semester: string
  gpa: number
  attendance: number
  subjects: {
    name: string
    grade: string
    marks: number
  }[]
  status: "excellent" | "good" | "average" | "poor"
}

export function StudentPerformance() {
  const [students, setStudents] = useState<StudentPerformance[]>([])
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedSemester, setSelectedSemester] = useState("1")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStudentPerformance()
  }, [selectedYear, selectedSemester])

  const loadStudentPerformance = async () => {
    // Mock data for demonstration
    setStudents([
      {
        id: "1",
        name: "Alice Johnson",
        rollNumber: "CS2024001",
        year: "2024",
        semester: "1",
        gpa: 3.8,
        attendance: 92,
        subjects: [
          { name: "Data Structures", grade: "A", marks: 88 },
          { name: "DBMS", grade: "A-", marks: 85 },
          { name: "Networks", grade: "B+", marks: 82 },
        ],
        status: "excellent",
      },
      {
        id: "2",
        name: "Bob Smith",
        rollNumber: "CS2024002",
        year: "2024",
        semester: "1",
        gpa: 3.2,
        attendance: 78,
        subjects: [
          { name: "Data Structures", grade: "B", marks: 75 },
          { name: "DBMS", grade: "B-", marks: 72 },
          { name: "Networks", grade: "C+", marks: 68 },
        ],
        status: "good",
      },
      {
        id: "3",
        name: "Carol Davis",
        rollNumber: "CS2024003",
        year: "2024",
        semester: "1",
        gpa: 2.8,
        attendance: 65,
        subjects: [
          { name: "Data Structures", grade: "C", marks: 65 },
          { name: "DBMS", grade: "C", marks: 62 },
          { name: "Networks", grade: "D+", marks: 58 },
        ],
        status: "average",
      },
    ])
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <Award className="h-4 w-4 text-green-600" />
      case "good":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "average":
        return <Users className="h-4 w-4 text-yellow-600" />
      case "poor":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "average":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance Overview</CardTitle>
          <CardDescription>Monitor student academic performance and attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Academic Year:</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Semester:</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">3.3</div>
                <p className="text-sm text-muted-foreground">Average GPA</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">78%</div>
                <p className="text-sm text-muted-foreground">Average Attendance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">45</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">At Risk</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
          <CardDescription>Detailed view of each student's academic progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                    </div>
                    <Badge className={getStatusColor(student.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(student.status)}
                        {student.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">GPA</span>
                        <span className="text-sm font-bold">{student.gpa}/4.0</span>
                      </div>
                      <Progress value={(student.gpa / 4.0) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Attendance</span>
                        <span className="text-sm font-bold">{student.attendance}%</span>
                      </div>
                      <Progress value={student.attendance} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Subject Performance</h4>
                    <div className="flex flex-wrap gap-2">
                      {student.subjects.map((subject) => (
                        <Badge key={subject.name} variant="outline">
                          {subject.name}: {subject.grade} ({subject.marks}%)
                        </Badge>
                      ))}
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

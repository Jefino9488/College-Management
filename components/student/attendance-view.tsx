"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UserCheck, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface AttendanceRecord {
  id: string
  subject: string
  subjectCode: string
  date: string
  status: "present" | "absent" | "late"
  totalClasses: number
  attendedClasses: number
  percentage: number
}

interface SubjectAttendance {
  subject: string
  subjectCode: string
  totalClasses: number
  attendedClasses: number
  percentage: number
  status: "good" | "warning" | "critical"
}

export function AttendanceView() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendanceData()
  }, [selectedMonth])

  const loadAttendanceData = async () => {
    try {
      // Mock data for demonstration
      setAttendanceRecords([
        {
          id: "1",
          subject: "Data Structures",
          subjectCode: "CS301",
          date: "2024-01-15",
          status: "present",
          totalClasses: 45,
          attendedClasses: 42,
          percentage: 93.3,
        },
        {
          id: "2",
          subject: "Database Systems",
          subjectCode: "CS302",
          date: "2024-01-15",
          status: "present",
          totalClasses: 40,
          attendedClasses: 35,
          percentage: 87.5,
        },
        {
          id: "3",
          subject: "Computer Networks",
          subjectCode: "CS303",
          date: "2024-01-14",
          status: "absent",
          totalClasses: 38,
          attendedClasses: 28,
          percentage: 73.7,
        },
        {
          id: "4",
          subject: "Software Engineering",
          subjectCode: "CS304",
          date: "2024-01-14",
          status: "late",
          totalClasses: 42,
          attendedClasses: 38,
          percentage: 90.5,
        },
      ])

      setSubjectAttendance([
        {
          subject: "Data Structures",
          subjectCode: "CS301",
          totalClasses: 45,
          attendedClasses: 42,
          percentage: 93.3,
          status: "good",
        },
        {
          subject: "Database Systems",
          subjectCode: "CS302",
          totalClasses: 40,
          attendedClasses: 35,
          percentage: 87.5,
          status: "good",
        },
        {
          subject: "Computer Networks",
          subjectCode: "CS303",
          totalClasses: 38,
          attendedClasses: 28,
          percentage: 73.7,
          status: "warning",
        },
        {
          subject: "Software Engineering",
          subjectCode: "CS304",
          totalClasses: 42,
          attendedClasses: 38,
          percentage: 90.5,
          status: "good",
        },
      ])
    } catch (error) {
      console.error("Failed to load attendance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const overallAttendance =
    subjectAttendance.reduce((sum, subject) => sum + subject.percentage, 0) / subjectAttendance.length

  return (
    <div className="space-y-6">
      {/* Overall Attendance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Overall Attendance</span>
            </div>
            <div className="text-2xl font-bold">{overallAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Classes Attended</span>
            </div>
            <div className="text-2xl font-bold">143</div>
            <p className="text-xs text-muted-foreground">Out of 165 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Absences</span>
            </div>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Late Arrivals</span>
            </div>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Your attendance breakdown by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAttendance.map((subject, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{subject.subject}</h3>
                      <p className="text-sm text-muted-foreground">{subject.subjectCode}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getAttendanceStatusColor(subject.status)}`}>
                        {subject.percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {subject.attendedClasses}/{subject.totalClasses} classes
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={subject.percentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Minimum required: 75%</span>
                      {subject.percentage < 75 && (
                        <span className="text-red-600 font-medium">
                          Need {Math.ceil((75 * subject.totalClasses) / 100 - subject.attendedClasses)} more classes
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your attendance records for the past few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.slice(0, 10).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

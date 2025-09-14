"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiService } from "@/lib/api"
import { CalendarIcon, UserCheck, Save, History } from "lucide-react"
import { format } from "date-fns"

interface AttendanceRecord {
  studentId: string
  studentName: string
  rollNumber: string
  status: "present" | "absent" | "late"
}

interface AttendanceHistory {
  date: string
  subject: string
  presentCount: number
  totalCount: number
  percentage: number
}

export function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      loadStudentsForAttendance()
    }
  }, [selectedClass, selectedSubject])

  useEffect(() => {
    loadAttendanceHistory()
  }, [])

  const loadStudentsForAttendance = async () => {
    try {
      // Mock data for demonstration
      setAttendanceRecords([
        {
          studentId: "1",
          studentName: "Alice Johnson",
          rollNumber: "CS2024001",
          status: "present",
        },
        {
          studentId: "2",
          studentName: "Bob Smith",
          rollNumber: "CS2024002",
          status: "present",
        },
        {
          studentId: "3",
          studentName: "Carol Davis",
          rollNumber: "CS2023015",
          status: "absent",
        },
        {
          studentId: "4",
          studentName: "David Wilson",
          rollNumber: "CS2024003",
          status: "present",
        },
      ])
    } catch (err) {
      setError("Failed to load students")
    }
  }

  const loadAttendanceHistory = async () => {
    try {
      // Mock data for demonstration
      setAttendanceHistory([
        {
          date: "2024-01-15",
          subject: "Data Structures",
          presentCount: 38,
          totalCount: 42,
          percentage: 90.5,
        },
        {
          date: "2024-01-14",
          subject: "Database Systems",
          presentCount: 35,
          totalCount: 42,
          percentage: 83.3,
        },
        {
          date: "2024-01-13",
          subject: "Computer Networks",
          presentCount: 40,
          totalCount: 42,
          percentage: 95.2,
        },
      ])
    } catch (err) {
      setError("Failed to load attendance history")
    }
  }

  const updateAttendanceStatus = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.studentId === studentId ? { ...record, status } : record)),
    )
  }

  const handleSubmitAttendance = async () => {
    if (!selectedSubject || !selectedClass) {
      setError("Please select subject and class")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // In a real implementation, you would submit to the API
      for (const record of attendanceRecords) {
        await ApiService.submitAttendance({
          studentId: record.studentId,
          date: format(selectedDate, "yyyy-MM-dd"),
          status: record.status,
          subjectId: selectedSubject,
        })
      }

      setSuccess("Attendance submitted successfully!")
      loadAttendanceHistory()
    } catch (err) {
      setError("Failed to submit attendance")
    } finally {
      setLoading(false)
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

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "text-green-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Attendance Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Mark Attendance
          </CardTitle>
          <CardDescription>Record student attendance for classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ds">Data Structures</SelectItem>
                  <SelectItem value="dbms">Database Systems</SelectItem>
                  <SelectItem value="networks">Computer Networks</SelectItem>
                  <SelectItem value="algorithms">Algorithms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs2024-1">CS 2024 - Semester 1</SelectItem>
                  <SelectItem value="cs2023-2">CS 2023 - Semester 2</SelectItem>
                  <SelectItem value="cs2022-3">CS 2022 - Semester 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSubmitAttendance} disabled={loading || !selectedSubject || !selectedClass}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </div>

          {/* Student Attendance List */}
          {attendanceRecords.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Student Attendance</h3>
              <div className="space-y-2">
                {attendanceRecords.map((record) => (
                  <div key={record.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-muted-foreground">{record.rollNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={record.status === "present" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendanceStatus(record.studentId, "present")}
                      >
                        Present
                      </Button>
                      <Button
                        variant={record.status === "late" ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendanceStatus(record.studentId, "late")}
                      >
                        Late
                      </Button>
                      <Button
                        variant={record.status === "absent" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => updateAttendanceStatus(record.studentId, "absent")}
                      >
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Attendance History
          </CardTitle>
          <CardDescription>Recent attendance records and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{record.subject}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(record.date), "PPP")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Present</p>
                    <p className="text-sm text-muted-foreground">
                      {record.presentCount}/{record.totalCount}
                    </p>
                  </div>
                  <Badge className={getStatusColor("present")}>
                    <span className={getAttendanceColor(record.percentage)}>{record.percentage.toFixed(1)}%</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

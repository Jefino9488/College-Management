"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { departmentApi, staffApi, attendanceApi, profileApi } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "sonner"
import { Loader2, Plus, Users, BookOpen, Calendar } from "lucide-react"

export default function DashboardPage() {
    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <DashboardContent />
                </div>
            </div>
            <Toaster position="top-right" richColors />
        </AuthGuard>
    )
}

function DashboardContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [departments, setDepartments] = useState<any[]>([])
    const [staff, setStaff] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [attendance, setAttendance] = useState<any[]>([])
    const [grades, setGrades] = useState<any[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true)
            try {
                if (user?.role === "PRINCIPAL" && user?.id) {
                    // Fetch departments for the principal's college
                    const collegeId = user.collegeId || "1" // Assuming collegeId is available or default
                    const deptResponse = await departmentApi.getDepartmentsByCollege(collegeId)
                    setDepartments(deptResponse.data || [])
                } else if (user?.role === "HOD" && user?.id) {
                    // Fetch students for the HOD's department
                    const staffResponse = await staffApi.getStudents(user.department, 2023) // Example year
                    setStaff(staffResponse.data || [])

                    // Fetch subjects from HOD API (assuming department is linked)
                    const subjectResponse = await departmentApi.getDepartmentsByCollege(user.collegeId || "1")
                    const dept = subjectResponse.data.find((d: any) => d.name === user.department)
                    setSubjects(dept?.subjects || [])
                } else if (user?.role === "STAFF" && user?.id) {
                    // Fetch students and subjects assigned to staff
                    const staffResponse = await staffApi.getStudents(user.department, 2023) // Example year
                    setStaff(staffResponse.data || [])
                    setSubjects([]) // Replace with actual subject fetch if available
                } else if (user?.role === "STUDENT" && user?.id) {
                    // Fetch attendance history
                    const attendanceResponse = await attendanceApi.getAttendanceHistory(
                        user.department,
                        2023, // Example academic year
                        1     // Example semester
                    )
                    setAttendance(attendanceResponse.data || [])

                    // Fetch profile including grades
                    const profileResponse = await profileApi.getProfile(user.id)
                    setGrades(profileResponse.data?.grades || [])
                }
            } catch (error: any) {
                console.error("Error fetching dashboard data:", error)
                toast.error("Error", {
                    description: "Failed to load dashboard data. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (user) {
            fetchDashboardData()
        }
    }, [user])

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Principal Dashboard
    if (user?.role === "PRINCIPAL") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">{user.collegeName || "College"} Dashboard</h1>
                    <Button onClick={() => toast.success("Add Department clicked!")}>
                        <Plus className="mr-2 h-4 w-4" /> Add Department
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{departments.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{staff.length || 42}</div> {/* Update with real data */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{staff.length || 1234}</div> {/* Update with real data */}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {departments.length > 0 ? (
                            <div className="space-y-4">
                                {departments.map((dept) => (
                                    <div key={dept.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">{dept.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {dept.code} • {dept.hod?.firstName || "No HOD assigned"}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No departments found. Add a department to get started.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // HOD Dashboard
    if (user?.role === "HOD") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => toast.success("Add Subject clicked!")}>
                            <Plus className="mr-2 h-4 w-4" /> Add Subject
                        </Button>
                        <Button onClick={() => toast.success("Add Staff clicked!")}>
                            <Plus className="mr-2 h-4 w-4" /> Add Staff
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Department</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.department || "Department"}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{staff.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subjects.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="staff">
                    <TabsList>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                        <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    </TabsList>
                    <TabsContent value="staff" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Staff Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {staff.length > 0 ? (
                                    <div className="space-y-4">
                                        {staff.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div>
                                                    <h3 className="font-medium">
                                                        {member.firstName} {member.lastName}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {member.email}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No staff members found. Add staff to get started.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="subjects" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Subjects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {subjects.length > 0 ? (
                                    <div className="space-y-4">
                                        {subjects.map((subject) => (
                                            <div key={subject.id} className="flex items-center justify-between rounded-lg border p-4">
                                                <div>
                                                    <h3 className="font-medium">{subject.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No subjects found. Add subjects to get started.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    // Staff Dashboard
    if (user?.role === "STAFF") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
                    <div className="flex gap-2">
                        <Button onClick={() => toast.success("Mark Attendance clicked!")}>
                            <Calendar className="mr-2 h-4 w-4" /> Mark Attendance
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Department</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.department || "Department"}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned Classes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{subjects.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{staff.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {subjects.length > 0 ? (
                            <div className="space-y-4">
                                {subjects.map((subject) => (
                                    <div key={subject.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">{subject.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {subject.code} • {subject.students || 0} students
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                Attendance
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Grades
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">No classes assigned yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Student Dashboard
    if (user?.role === "STUDENT") {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Department</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.department || "Department"}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {attendance.length > 0
                                    ? `${Math.round((attendance.filter(a => a.status === "PRESENT").length / attendance.length) * 100)}%`
                                    : "N/A"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {grades.length > 0
                                    ? `${grades.reduce((sum: number, grade: any) => sum + (grade.score || 0), 0) / grades.length}`
                                    : "N/A"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="attendance">
                    <TabsList>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="grades">Grades</TabsTrigger>
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    </TabsList>
                    <TabsContent value="attendance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {attendance.length > 0 ? (
                                    <div className="space-y-4">
                                        {attendance.map((record, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                                                <div>
                                                    <h3 className="font-medium">{record.subjectCode || "Subject"}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(record.date).toLocaleDateString()} • {record.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No attendance records found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="grades" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grades</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {grades.length > 0 ? (
                                    <div className="space-y-4">
                                        {grades.map((grade, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                                                <div>
                                                    <h3 className="font-medium">{grade.subject || "Subject"}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {grade.examName || "Exam"} • Score: {grade.score || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No grades found.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="schedule" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Placeholder - replace with real schedule data */}
                                <p className="text-center text-muted-foreground">No upcoming classes scheduled.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    return (
        <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Dashboard not available for your role.</p>
        </div>
    )
}
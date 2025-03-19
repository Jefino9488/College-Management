"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { attendanceApi, staffApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Check, Loader2, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Toaster, toast } from "sonner"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function AttendancePage() {
    return (
        <AuthGuard allowedRoles={["STAFF", "STUDENT"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <AttendanceContent />
                </div>
                <Toaster position="top-right" richColors />
            </div>
        </AuthGuard>
    )
}

function AttendanceContent() {
    const { user } = useAuth()

    if (user?.role === "STAFF") {
        return <StaffAttendanceContent />
    } else {
        return <StudentAttendanceContent />
    }
}

function StaffAttendanceContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [students, setStudents] = useState<any[]>([])
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [department, setDepartment] = useState<string>("")
    const [semester, setSemester] = useState<string>("")
    const [academicYear, setAcademicYear] = useState<string>("")
    const [attendanceData, setAttendanceData] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        const fetchStudents = async () => {
            if (!user?.department) return

            setIsLoading(true)
            try {
                const response = await staffApi.getStudentsByDepartmentAndYear({
                    department: user.department,
                    academicYear: parseInt(academicYear) || new Date().getFullYear(), // Default to current year
                })
                setStudents(response.data || [])
            } catch (error: any) {
                console.error("Error fetching students:", error)
                toast.error("Error", {
                    description: error.response?.data?.message || "Failed to load students. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (department && academicYear) fetchStudents()
    }, [user, department, academicYear])

    useEffect(() => {
        const initialAttendance: { [key: string]: boolean } = {}
        students.forEach((student) => {
            initialAttendance[student.id] = true // Default to present
        })
        setAttendanceData(initialAttendance)
    }, [students])

    const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
        setAttendanceData((prev) => ({
            ...prev,
            [studentId]: isPresent,
        }))
    }

    const handleSubmitAttendance = async () => {
        if (!date) {
            toast.error("Error", {
                description: "Please select a date for attendance.",
                duration: 5000,
            })
            return
        }

        if (!department) {
            toast.error("Error", {
                description: "Please select a department.",
                duration: 5000,
            })
            return
        }

        if (!semester) {
            toast.error("Error", {
                description: "Please select a semester.",
                duration: 5000,
            })
            return
        }

        if (!academicYear) {
            toast.error("Error", {
                description: "Please select an academic year.",
                duration: 5000,
            })
            return
        }

        setIsSubmitting(true)

        try {
            const attendanceRequestDTO = {
                date: format(date, "yyyy-MM-dd"),
                department,
                semester: parseInt(semester),
                academicYear: parseInt(academicYear),
                studentAttendance: Object.entries(attendanceData).map(([studentId, present]) => ({
                    studentId: parseInt(studentId),
                    present,
                })),
            }

            const response = await attendanceApi.submitAttendance(attendanceRequestDTO)
            if (response.data.status) {
                toast.success("Success", {
                    description: response.data.message || "Attendance submitted successfully.",
                    duration: 3000,
                })
            }
        } catch (error: any) {
            console.error("Error submitting attendance:", error)
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to submit attendance. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"]
    const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const academicYears = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Form</CardTitle>
                    <CardDescription>Mark attendance for students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select value={department} onValueChange={setDepartment}>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger id="semester">
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>
                                            {sem}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="academicYear">Academic Year</Label>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger id="academicYear">
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {academicYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : students.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={Object.values(attendanceData).every((v) => v)}
                                                onCheckedChange={(checked) => {
                                                    const newAttendance: { [key: string]: boolean } = {}
                                                    students.forEach((student) => {
                                                        newAttendance[student.id] = checked === true
                                                    })
                                                    setAttendanceData(newAttendance)
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Semester</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={attendanceData[student.id] || false}
                                                    onCheckedChange={(checked) =>
                                                        handleAttendanceChange(student.id, checked === true)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {student.firstName} {student.lastName}
                                            </TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.department}</TableCell>
                                            <TableCell>{student.semester}</TableCell>
                                            <TableCell className="text-right">
                                                {attendanceData[student.id] ? (
                                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                                        <Check className="mr-1 h-3 w-3" />
                                                        Present
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                                                        <X className="mr-1 h-3 w-3" />
                                                        Absent
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex h-32 flex-col items-center justify-center">
                            <p className="text-center text-muted-foreground">No students found for the selected criteria.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button
                        onClick={handleSubmitAttendance}
                        disabled={isSubmitting || isLoading || students.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Attendance"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

function StudentAttendanceContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [attendance, setAttendance] = useState<any[]>([])
    const [selectedSubject, setSelectedSubject] = useState<string>("all")
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 10

    useEffect(() => {
        const fetchAttendance = async () => {
            if (!user?.department) return

            setIsLoading(true)
            try {
                const response = await attendanceApi.getAttendanceHistory({
                    department: user.department,
                    academicYear: new Date().getFullYear(),
                    semester: 1, // Adjust based on student data or add a selector
                })
                setAttendance(response.data || [])
            } catch (error: any) {
                console.error("Error fetching attendance:", error)
                toast.error("Error", {
                    description: error.response?.data?.message || "Failed to load attendance data. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchAttendance()
    }, [user])

    const subjects = [...new Set(attendance.map((record) => record.subject))]

    const filteredAttendance = attendance.filter((record) => {
        const recordDate = new Date(record.date)
        const recordMonth = recordDate.toISOString().slice(0, 7)
        return (selectedSubject === "all" || record.subject === selectedSubject) && recordMonth === selectedMonth
    })

    const attendanceByDate = filteredAttendance.reduce((acc, record) => {
        const date = new Date(record.date).toISOString().slice(0, 10)
        if (!acc[date]) {
            acc[date] = []
        }
        acc[date].push(record)
        return acc
    }, {})

    const sortedDates = Object.keys(attendanceByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const totalPages = Math.ceil(sortedDates.length / itemsPerPage)
    const paginatedDates = sortedDates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const calculateAttendancePercentage = (subject = null) => {
        const relevantRecords = subject ? attendance.filter((record) => record.subject === subject) : attendance
        if (relevantRecords.length === 0) return 0
        const presentCount = relevantRecords.filter((record) => record.present).length
        return Math.round((presentCount / relevantRecords.length) * 100)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{calculateAttendancePercentage()}%</div>
                            </CardContent>
                        </Card>

                        {subjects.slice(0, 3).map((subject) => (
                            <Card key={subject}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">{subject}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{calculateAttendancePercentage(subject)}%</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Records</CardTitle>
                            <CardDescription>View and filter your attendance records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                                <div className="w-full sm:w-1/2">
                                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Subjects</SelectItem>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject} value={subject}>
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 6 }, (_, i) => {
                                                const date = new Date()
                                                date.setMonth(date.getMonth() - i)
                                                const monthYear = date.toISOString().slice(0, 7)
                                                const monthName = date.toLocaleString("default", {
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                return (
                                                    <SelectItem key={monthYear} value={monthYear}>
                                                        {monthName}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Tabs defaultValue="list">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="list">List View</TabsTrigger>
                                    <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                                </TabsList>

                                <TabsContent value="list">
                                    {paginatedDates.length > 0 ? (
                                        <div className="space-y-4">
                                            {paginatedDates.map((date) => (
                                                <div key={date} className="rounded-lg border">
                                                    <div className="border-b bg-muted/50 px-4 py-2 font-medium">
                                                        {new Date(date).toLocaleDateString(undefined, {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                    <div className="p-4">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Subject</TableHead>
                                                                    <TableHead className="text-right">Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {attendanceByDate[date].map((record: any) => (
                                                                    <TableRow key={record.id}>
                                                                        <TableCell>{record.subject}</TableCell>
                                                                        <TableCell className="text-right">
                                                                            {record.present ? (
                                                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                                                                    <Check className="mr-1 h-3 w-3" />
                                                                                    Present
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                                                                                    <X className="mr-1 h-3 w-3" />
                                                                                    Absent
                                                                                </span>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            ))}

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
                                                                onClick={() =>
                                                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                                }
                                                                className={
                                                                    currentPage === totalPages
                                                                        ? "pointer-events-none opacity-50"
                                                                        : ""
                                                                }
                                                            />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex h-32 flex-col items-center justify-center">
                                            <p className="text-center text-muted-foreground">
                                                No attendance records found for the selected filters.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="calendar">
                                    <div className="rounded-lg border p-4">
                                        <div className="grid grid-cols-7 gap-2 text-center">
                                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                                <div key={day} className="font-medium">
                                                    {day}
                                                </div>
                                            ))}
                                            <div className="col-span-7 mt-2 text-center text-muted-foreground">
                                                Calendar view would display a monthly calendar with attendance status for each
                                                day.
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
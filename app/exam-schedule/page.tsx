"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { scheduleApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"

export default function ExamSchedulePage() {
    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <ExamScheduleContent />
                </div>
            </div>
        </AuthGuard>
    )
}

function ExamScheduleContent() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [exams, setExams] = useState<any[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
    const [selectedSemester, setSelectedSemester] = useState<string>("all")
    const [examToDelete, setExamToDelete] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [newExam, setNewExam] = useState({
        examName: "",
        department: "",
        date: new Date(),
        time: "",
        session: "FN",
        type: "Offline",
        semester: "",
        subject: "",
    })

    const canModifyExams = user?.role === "STAFF" || user?.role === "HOD"

    useEffect(() => {
        const fetchExams = async () => {
            setIsLoading(true)
            try {
                const response = await scheduleApi.getSchedule()
                setExams(response.data || [])
            } catch (error) {
                console.error("Error fetching exam schedule:", error)
                toast({
                    title: "Error",
                    description: "Failed to load exam schedule. Please try again.",
                    variant: "destructive",
                })

                // For demo purposes, set some sample data
                const sampleExams = []
                const subjects = [
                    "Mathematics",
                    "Physics",
                    "Computer Science",
                    "English",
                    "Database Systems",
                    "Operating Systems",
                ]
                const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering"]
                const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]

                for (let i = 1; i <= 20; i++) {
                    const examDate = new Date()
                    examDate.setDate(examDate.getDate() + Math.floor(Math.random() * 30))

                    sampleExams.push({
                        id: `exam-${i}`,
                        examName: `${["Mid-Term", "Final", "Quiz", "Lab Test"][Math.floor(Math.random() * 4)]} Exam`,
                        department: departments[Math.floor(Math.random() * departments.length)],
                        date: examDate.toISOString(),
                        time: `${Math.floor(Math.random() * 12) + 1}:00`,
                        session: Math.random() > 0.5 ? "FN" : "AN",
                        type: Math.random() > 0.3 ? "Offline" : "Online",
                        semester: semesters[Math.floor(Math.random() * semesters.length)],
                        subject: subjects[Math.floor(Math.random() * subjects.length)],
                    })
                }

                setExams(sampleExams)
            } finally {
                setIsLoading(false)
            }
        }

        fetchExams()
    }, [toast])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewExam((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setNewExam((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setNewExam((prev) => ({
                ...prev,
                date,
            }))
        }
    }

    const handleAddExam = async () => {
        try {
            const examData = {
                ...newExam,
                date: newExam.date.toISOString().split("T")[0],
            }

            await scheduleApi.addSchedule(examData)

            // Add the new exam to the list
            setExams((prev) => [
                ...prev,
                {
                    id: `exam-${Date.now()}`,
                    ...examData,
                },
            ])

            setIsAddDialogOpen(false)
            setNewExam({
                examName: "",
                department: "",
                date: new Date(),
                time: "",
                session: "FN",
                type: "Offline",
                semester: "",
                subject: "",
            })

            toast({
                title: "Success",
                description: "Exam schedule added successfully.",
            })
        } catch (error) {
            console.error("Error adding exam schedule:", error)
            toast({
                title: "Error",
                description: "Failed to add exam schedule. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteExam = async () => {
        if (!examToDelete) return

        try {
            await scheduleApi.deleteSchedule(examToDelete)

            // Remove the exam from the list
            setExams((prev) => prev.filter((exam) => exam.id !== examToDelete))

            setExamToDelete(null)
            setIsDeleteDialogOpen(false)

            toast({
                title: "Success",
                description: "Exam schedule deleted successfully.",
            })
        } catch (error) {
            console.error("Error deleting exam schedule:", error)
            toast({
                title: "Error",
                description: "Failed to delete exam schedule. Please try again.",
                variant: "destructive",
            })
        }
    }

    const departments = [...new Set(exams.map((exam) => exam.department))]
    const semesters = [...new Set(exams.map((exam) => exam.semester))]

    const filteredExams = exams.filter((exam) => {
        return (
            (selectedDepartment === "all" || exam.department === selectedDepartment) &&
            (selectedSemester === "all" || exam.semester === selectedSemester)
        )
    })

    // Sort exams by date
    const sortedExams = [...filteredExams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Exam Schedule</h1>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex gap-2">
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Semesters</SelectItem>
                                {semesters.map((sem) => (
                                    <SelectItem key={sem} value={sem}>
                                        Semester {sem}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {canModifyExams && (
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Add Exam
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Exam</DialogTitle>
                                    <DialogDescription>Create a new exam schedule. Fill in all the details below.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="examName">Exam Name</Label>
                                            <Input
                                                id="examName"
                                                name="examName"
                                                value={newExam.examName}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Mid-Term Exam"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select
                                                value={newExam.department}
                                                onValueChange={(value) => handleSelectChange("department", value)}
                                            >
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
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {newExam.date ? format(newExam.date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar mode="single" selected={newExam.date} onSelect={handleDateChange} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time">Time</Label>
                                            <Input
                                                id="time"
                                                name="time"
                                                value={newExam.time}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 10:00 AM"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="session">Session</Label>
                                            <Select value={newExam.session} onValueChange={(value) => handleSelectChange("session", value)}>
                                                <SelectTrigger id="session">
                                                    <SelectValue placeholder="Select session" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="FN">Forenoon (FN)</SelectItem>
                                                    <SelectItem value="AN">Afternoon (AN)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Select value={newExam.type} onValueChange={(value) => handleSelectChange("type", value)}>
                                                <SelectTrigger id="type">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Offline">Offline</SelectItem>
                                                    <SelectItem value="Online">Online</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="semester">Semester</Label>
                                            <Input
                                                id="semester"
                                                name="semester"
                                                value={newExam.semester}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={newExam.subject}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Database Systems"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAddExam}>Add Exam</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : sortedExams.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Exams</CardTitle>
                        <CardDescription>View all scheduled exams</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Exam Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Semester</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        {canModifyExams && <TableHead className="text-right">Actions</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedExams.map((exam) => (
                                        <TableRow key={exam.id}>
                                            <TableCell className="font-medium">{exam.examName}</TableCell>
                                            <TableCell>{exam.subject}</TableCell>
                                            <TableCell>{exam.department}</TableCell>
                                            <TableCell>{exam.semester}</TableCell>
                                            <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {exam.time} {exam.session === "FN" ? "AM" : "PM"}
                                            </TableCell>
                                            <TableCell>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                exam.type === "Online"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            }`}
                        >
                          {exam.type}
                        </span>
                                            </TableCell>
                                            {canModifyExams && (
                                                <TableCell className="text-right">
                                                    <AlertDialog
                                                        open={isDeleteDialogOpen && examToDelete === exam.id}
                                                        onOpenChange={(open) => {
                                                            setIsDeleteDialogOpen(open)
                                                            if (!open) setExamToDelete(null)
                                                        }}
                                                    >
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => setExamToDelete(exam.id)}>
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Exam Schedule</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this exam schedule? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDeleteExam} className="bg-red-500 hover:bg-red-600">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex h-32 flex-col items-center justify-center">
                        <p className="text-center text-muted-foreground">No exams found for the selected filters.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


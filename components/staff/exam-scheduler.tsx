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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/lib/api"
import { CalendarIcon, Plus, Clock, MapPin, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface ExamSchedule {
    id: string
    examName: string
    date: string
    time: string
    session: string
    type: "Offline" | "Online"
    department: string
    semester: string
}

const initialFormState = {
    examName: "",
    date: "",
    time: "",
    session: "FN",
    type: "Offline" as "Offline" | "Online",
    department: "Computer Science",
    semester: "1",
};

export function ExamScheduler() {
    const [exams, setExams] = useState<ExamSchedule[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [examForm, setExamForm] = useState(initialFormState);
    const [editingExam, setEditingExam] = useState<ExamSchedule | null>(null);

    useEffect(() => {
        loadExamSchedules()
    }, [])

    const loadExamSchedules = async () => {
        try {
            const data = await ApiService.getSchedule("All", "All");
            setExams(data);
        } catch (err) {
            setError("Failed to load exam schedules")
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (editingExam) {
                await ApiService.updateSchedule(editingExam.id, { ...examForm, id: editingExam.id });
                toast.success("Exam updated successfully!");
            } else {
                await ApiService.addSchedule(examForm);
                toast.success("Exam scheduled successfully!");
            }

            setExamForm(initialFormState);
            setSelectedDate(undefined);
            setEditingExam(null);
            loadExamSchedules();
        } catch (err: any) {
            setError(err.message || "Failed to schedule exam");
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteExam = async (examId: string) => {
        try {
            await ApiService.deleteSchedule(examId)
            toast.success("Exam deleted successfully!")
            loadExamSchedules()
        } catch (err: any) {
            setError(err.message || "Failed to delete exam")
        }
    }

    const openEditDialog = (exam: ExamSchedule) => {
        setEditingExam(exam);
        setExamForm({
            examName: exam.examName,
            date: exam.date,
            time: exam.time,
            session: exam.session,
            type: exam.type,
            department: exam.department,
            semester: exam.semester
        });
        setSelectedDate(new Date(exam.date));
    };

    const getExamTypeColor = (type: string) => {
        return type === "Offline" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";
    }

    const sortedExams = exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const dialogTitle = editingExam ? "Edit Exam Schedule" : "Schedule New Exam";
    const buttonText = editingExam ? "Save Changes" : "Schedule Exam";
    const loadingText = editingExam ? "Saving..." : "Scheduling...";

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5" />
                                Exam Scheduler
                            </CardTitle>
                            <CardDescription>Schedule and manage exams for your classes</CardDescription>
                        </div>
                        <Dialog open={editingExam !== null} onOpenChange={(isOpen) => !isOpen && setEditingExam(null)}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setExamForm(initialFormState); setSelectedDate(undefined); setEditingExam({} as ExamSchedule)}}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Exam
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{dialogTitle}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="examName">Exam Name</Label>
                                        <Input
                                            id="examName"
                                            value={examForm.examName}
                                            onChange={(e) => setExamForm({ ...examForm, examName: e.target.value })}
                                            placeholder="e.g., Midterm CS101"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={(date) => {
                                                        setSelectedDate(date)
                                                        if (date) {
                                                            setExamForm({ ...examForm, date: format(date, "yyyy-MM-dd") })
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? loadingText : buttonText}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedExams.map((exam) => (
                            <Card key={exam.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg">{exam.examName}</h3>
                                                <Badge className={getExamTypeColor(exam.type)}>{exam.type}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-4 w-4" />
                                                    {format(new Date(exam.date), "PPP")}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {exam.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(exam)}>
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteExam(exam.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
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

interface ExamSchedule {
  id: string
  subject: string
  date: string
  time: string
  duration: string
  room: string
  type: "midterm" | "final" | "quiz" | "assignment"
  department: string
  semester: string
}

export function ExamScheduler() {
  const [exams, setExams] = useState<ExamSchedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [examForm, setExamForm] = useState({
    subject: "",
    date: "",
    time: "",
    duration: "",
    room: "",
    type: "midterm" as const,
    department: "Computer Science",
    semester: "1",
  })

  useEffect(() => {
    loadExamSchedules()
  }, [])

  const loadExamSchedules = async () => {
    try {
      // Mock data for demonstration
      setExams([
        {
          id: "1",
          subject: "Data Structures",
          date: "2024-02-15",
          time: "09:00",
          duration: "3 hours",
          room: "Room 101",
          type: "midterm",
          department: "Computer Science",
          semester: "1",
        },
        {
          id: "2",
          subject: "Database Systems",
          date: "2024-02-17",
          time: "14:00",
          duration: "2 hours",
          room: "Room 205",
          type: "final",
          department: "Computer Science",
          semester: "1",
        },
        {
          id: "3",
          subject: "Computer Networks",
          date: "2024-02-20",
          time: "10:00",
          duration: "2.5 hours",
          room: "Room 301",
          type: "midterm",
          department: "Computer Science",
          semester: "1",
        },
      ])
    } catch (err) {
      setError("Failed to load exam schedules")
    }
  }

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await ApiService.addSchedule({
        subject: examForm.subject,
        date: examForm.date,
        time: examForm.time,
        type: examForm.type,
        department: examForm.department,
      })

      setExamForm({
        subject: "",
        date: "",
        time: "",
        duration: "",
        room: "",
        type: "midterm",
        department: "Computer Science",
        semester: "1",
      })
      setSelectedDate(undefined)
      setSuccess("Exam scheduled successfully!")
      loadExamSchedules()
    } catch (err) {
      setError("Failed to schedule exam")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExam = async (examId: string) => {
    try {
      await ApiService.deleteSchedule(examId)
      setSuccess("Exam deleted successfully!")
      loadExamSchedules()
    } catch (err) {
      setError("Failed to delete exam")
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "final":
        return "bg-red-100 text-red-800"
      case "midterm":
        return "bg-blue-100 text-blue-800"
      case "quiz":
        return "bg-green-100 text-green-800"
      case "assignment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const sortedExams = exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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

      {/* Add Exam */}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule New Exam</DialogTitle>
                  <DialogDescription>Add a new exam to the schedule</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddExam} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={examForm.subject}
                      onValueChange={(value) => setExamForm({ ...examForm, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                        <SelectItem value="Database Systems">Database Systems</SelectItem>
                        <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                        <SelectItem value="Algorithms">Algorithms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select
                      value={examForm.type}
                      onValueChange={(value: any) => setExamForm({ ...examForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">Midterm</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
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

                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={examForm.time}
                      onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={examForm.duration}
                      onChange={(e) => setExamForm({ ...examForm, duration: e.target.value })}
                      placeholder="e.g., 2 hours"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      value={examForm.room}
                      onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                      placeholder="e.g., Room 101"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Scheduling..." : "Schedule Exam"}
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
                        <h3 className="font-semibold text-lg">{exam.subject}</h3>
                        <Badge className={getExamTypeColor(exam.type)}>{exam.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(new Date(exam.date), "PPP")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.time} ({exam.duration})
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exam.room}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
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

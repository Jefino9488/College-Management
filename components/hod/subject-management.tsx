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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/lib/api"
import { BookOpen, Plus, Clock, Users } from "lucide-react"

interface Subject {
  id: string
  name: string
  code: string
  credits: number
  enrolledStudents: number
  assignedTeacher?: string
}

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

    const [subjectForm, setSubjectForm] = useState({
        name: "",
        code: "",
        credits: 0,
        departmentId: 1, // You should fetch the HOD's actual departmentId here
        semester: 1,
        year: 1,
    });

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    // Mock data for demonstration
    setSubjects([
      {
        id: "1",
        name: "Data Structures and Algorithms",
        code: "CS301",
        credits: 4,
        enrolledStudents: 45,
        assignedTeacher: "Dr. Johnson",
      },
      {
        id: "2",
        name: "Database Management Systems",
        code: "CS302",
        credits: 3,
        enrolledStudents: 42,
        assignedTeacher: "Prof. Smith",
      },
      {
        id: "3",
        name: "Computer Networks",
        code: "CS303",
        credits: 3,
        enrolledStudents: 38,
      },
    ])
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
        await ApiService.addSubject(subjectForm);
      setSubjectForm({ name: "", code: "", credits: 0, departmentId: "current-dept" })
      loadSubjects()
    } catch (err) {
      setError("Failed to add subject")
    } finally {
      setLoading(false)
    }
  }

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
                <BookOpen className="h-5 w-5" />
                Subject Management
              </CardTitle>
              <CardDescription>Manage subjects and curriculum for your department</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                  <DialogDescription>Create a new subject for the department</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubject} className="space-y-4">
                  <div>
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                      id="subjectName"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                      required
                      placeholder="e.g., Data Structures and Algorithms"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subjectCode">Subject Code</Label>
                    <Input
                      id="subjectCode"
                      value={subjectForm.code}
                      onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                      required
                      placeholder="e.g., CS301"
                    />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={subjectForm.credits}
                      onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number.parseInt(e.target.value) })}
                      required
                      min="1"
                      max="6"
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Subject"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {subject.credits} Credits
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {subject.enrolledStudents} Students
                      </Badge>
                    </div>

                    {subject.assignedTeacher && (
                      <p className="text-sm">
                        <span className="font-medium">Teacher:</span> {subject.assignedTeacher}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Details
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

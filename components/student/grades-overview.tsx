"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, TrendingUp, BookOpen, Target } from "lucide-react"

interface Grade {
  id: string
  subject: string
  subjectCode: string
  credits: number
  grade: string
  marks: number
  maxMarks: number
  examType: "midterm" | "final" | "assignment" | "quiz"
  semester: string
  academicYear: string
}

interface GPA {
  semester: string
  gpa: number
  credits: number
}

export function GradesOverview() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [gpaHistory, setGpaHistory] = useState<GPA[]>([])
  const [selectedSemester, setSelectedSemester] = useState("current")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGrades()
    loadGPAHistory()
  }, [selectedSemester])

  const loadGrades = async () => {
    try {
      // Mock data for demonstration
      setGrades([
        {
          id: "1",
          subject: "Data Structures and Algorithms",
          subjectCode: "CS301",
          credits: 4,
          grade: "A",
          marks: 88,
          maxMarks: 100,
          examType: "final",
          semester: "1",
          academicYear: "2024",
        },
        {
          id: "2",
          subject: "Database Management Systems",
          subjectCode: "CS302",
          credits: 3,
          grade: "A-",
          marks: 85,
          maxMarks: 100,
          examType: "final",
          semester: "1",
          academicYear: "2024",
        },
        {
          id: "3",
          subject: "Computer Networks",
          subjectCode: "CS303",
          credits: 3,
          grade: "B+",
          marks: 82,
          maxMarks: 100,
          examType: "final",
          semester: "1",
          academicYear: "2024",
        },
        {
          id: "4",
          subject: "Software Engineering",
          subjectCode: "CS304",
          credits: 4,
          grade: "A",
          marks: 90,
          maxMarks: 100,
          examType: "final",
          semester: "1",
          academicYear: "2024",
        },
      ])
    } catch (error) {
      console.error("Failed to load grades:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadGPAHistory = async () => {
    try {
      // Mock data for demonstration
      setGpaHistory([
        { semester: "Semester 1", gpa: 3.7, credits: 14 },
        { semester: "Semester 2", gpa: 3.5, credits: 16 },
        { semester: "Semester 3", gpa: 3.8, credits: 15 },
        { semester: "Current", gpa: 3.6, credits: 14 },
      ])
    } catch (error) {
      console.error("Failed to load GPA history:", error)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
      case "A+":
        return "bg-green-100 text-green-800"
      case "A-":
      case "B+":
        return "bg-blue-100 text-blue-800"
      case "B":
      case "B-":
        return "bg-yellow-100 text-yellow-800"
      case "C+":
      case "C":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "final":
        return "bg-purple-100 text-purple-800"
      case "midterm":
        return "bg-blue-100 text-blue-800"
      case "assignment":
        return "bg-green-100 text-green-800"
      case "quiz":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const currentGPA = gpaHistory.find((gpa) => gpa.semester === "Current")?.gpa || 0
  const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0)

  return (
    <div className="space-y-6">
      {/* GPA Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Current GPA</span>
            </div>
            <div className="text-2xl font-bold">{currentGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Out of 4.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Credits Earned</span>
            </div>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Class Rank</span>
            </div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Out of 45</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Trend</span>
            </div>
            <div className="text-2xl font-bold text-green-600">+0.2</div>
            <p className="text-xs text-muted-foreground">From last semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Semester Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Your grades and performance across subjects</CardDescription>
            </div>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Semester</SelectItem>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade) => (
              <Card key={grade.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{grade.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {grade.subjectCode} • {grade.credits} Credits
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getExamTypeColor(grade.examType)}>{grade.examType}</Badge>
                      <Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Score</span>
                      <span className="font-medium">
                        {grade.marks}/{grade.maxMarks} ({((grade.marks / grade.maxMarks) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={(grade.marks / grade.maxMarks) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GPA History */}
      <Card>
        <CardHeader>
          <CardTitle>GPA Trend</CardTitle>
          <CardDescription>Your academic progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gpaHistory.map((gpa, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{gpa.semester}</p>
                  <p className="text-sm text-muted-foreground">{gpa.credits} Credits</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{gpa.gpa.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">GPA</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

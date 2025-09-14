"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, TrendingUp, BookOpen, Target } from "lucide-react"
import { ApiService } from "@/lib/api" // Import ApiService

interface Grade {
    id: string
    subjectName: string
    subjectCode: string
    credits: number
    grade: string
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

    // MODIFIED: Fetches grades from the live API endpoint.
    const loadGrades = async () => {
        setLoading(true);
        try {
            const gradesData = await ApiService.getStudentGrades();
            setGrades(gradesData);
        } catch (error) {
            console.error("Failed to load grades:", error)
            // Fallback mock data
            setGrades([
                {
                    id: "1",
                    subjectName: "Data Structures and Algorithms",
                    subjectCode: "CS301",
                    credits: 4,
                    grade: "A",
                },
                {
                    id: "2",
                    subjectName: "Database Management Systems",
                    subjectCode: "CS302",
                    credits: 3,
                    grade: "A-",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    const loadGPAHistory = async () => {
        // This can be a future enhancement on the backend
        setGpaHistory([
            { semester: "Current", gpa: 3.6, credits: 14 },
        ])
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
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {grades.map((grade, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">{grade.subjectName}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {grade.subjectCode} • {grade.credits} Credits
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getGradeColor(grade.grade)}>{grade.grade}</Badge>
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

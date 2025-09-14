"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Users, Award, AlertCircle } from "lucide-react"
import { ApiService } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "../ui/skeleton"

interface StudentPerformance {
    id: string;
    name: string;
    rollNumber: string;
    year: string;
    semester: string;
    gpa: number;
    attendance: number;
    status: "excellent" | "good" | "average" | "poor";
}

export function StudentPerformance() {
    const [students, setStudents] = useState<StudentPerformance[]>([])
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStudentPerformance = async () => {
            setLoading(true);
            try {
                const data = await ApiService.getHodStudentPerformance(selectedYear, selectedSemester);
                setStudents(data);
            } catch (error: any) {
                toast.error("Failed to load student performance", { description: error.message });
            } finally {
                setLoading(false);
            }
        };
        loadStudentPerformance()
    }, [selectedYear, selectedSemester])


    const getStatusIcon = (status: string) => {
        switch (status) {
            case "excellent":
                return <Award className="h-4 w-4 text-green-600" />
            case "good":
                return <TrendingUp className="h-4 w-4 text-blue-600" />
            case "average":
                return <Users className="h-4 w-4 text-yellow-600" />
            case "poor":
                return <AlertCircle className="h-4 w-4 text-red-600" />
            default:
                return null
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "excellent":
                return "bg-green-100 text-green-800"
            case "good":
                return "bg-blue-100 text-blue-800"
            case "average":
                return "bg-yellow-100 text-yellow-800"
            case "poor":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Performance Overview</CardTitle>
                    <CardDescription>Monitor student academic performance and attendance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Academic Year:</label>
                            <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Semester:</label>
                            <Select value={String(selectedSemester)} onValueChange={(val) => setSelectedSemester(Number(val))}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Semester 1</SelectItem>
                                    <SelectItem value="2">Semester 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Individual Performance</CardTitle>
                    <CardDescription>Detailed view of each student's academic progress</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student) => (
                                <Card key={student.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold">{student.name}</h3>
                                                <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                                            </div>
                                            <Badge className={getStatusColor(student.status)}>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(student.status)}
                                                    {student.status}
                                                </div>
                                            </Badge>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-3 mb-4 items-center">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">GPA</span>
                                                    <span className="text-sm font-bold">{student.gpa.toFixed(2)}/4.0</span>
                                                </div>
                                                <Progress value={(student.gpa / 4.0) * 100} className="h-2" />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">Attendance</span>
                                                    <span className="text-sm font-bold">{student.attendance.toFixed(1)}%</span>
                                                </div>
                                                <Progress value={student.attendance} className="h-2" />
                                            </div>
                                            <div className="flex items-center gap-2 justify-end">
                                                <Button variant="outline" size="sm">View Details</Button>
                                                <Button variant="outline" size="sm">Contact</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, UserCheck, Calendar, DollarSign, BookOpen, Clock } from "lucide-react"
import { ApiService } from "@/lib/api"

interface StudentDashboardStats {
  currentGPA: number
  overallAttendance: number
  upcomingExams: number
  pendingFees: number
  completedCredits: number
  todaySchedule?: Array<{
    id: string
    subject: string
    type: string
    time: string
    room: string
  }>
  recentGrades?: Array<{
    id: string
    subject: string
    course: string
    grade: string
    score: string
  }>
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentDashboardStats>({
    currentGPA: 0,
    overallAttendance: 0,
    upcomingExams: 0,
    pendingFees: 0,
    completedCredits: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const studentStats = await ApiService.getStudentStats()
      setStats(studentStats)
    } catch (error) {
      console.error("Failed to load student dashboard data:", error)
      setStats({
        currentGPA: 3.6,
        overallAttendance: 85,
        upcomingExams: 2,
        pendingFees: 5000,
        completedCredits: 42,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your academic overview and recent activities.</p>
      </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Current GPA"
              value={stats.currentGPA.toFixed(1)}
              description="Out of 4.0"
              icon={Award}
              trend={{ value: 3, isPositive: true }}
            />
            <StatsCard
              title="Attendance"
              value={`${stats.overallAttendance}%`}
              description="This semester"
              icon={UserCheck}
              trend={{ value: -2, isPositive: false }}
            />
            <StatsCard title="Upcoming Exams" value={stats.upcomingExams} description="Next 2 weeks" icon={Calendar} />
            <StatsCard
              title="Pending Fees"
              value={`$${stats.pendingFees.toLocaleString()}`}
              description="Outstanding balance"
              icon={DollarSign}
            />
            <StatsCard
              title="Credits Earned"
              value={stats.completedCredits}
              description="This semester"
              icon={BookOpen}
              trend={{ value: 8, isPositive: true }}
            />
          </div>

          {/* Quick Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.todaySchedule && stats.todaySchedule.length > 0 ? (
                    stats.todaySchedule.map((schedule) => (
                      <div key={schedule.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            schedule.type === "Lecture"
                              ? "bg-blue-500"
                              : schedule.type === "Lab"
                                ? "bg-green-500"
                                : "bg-orange-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {schedule.subject} - {schedule.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {schedule.time} • {schedule.room}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Data Structures - Lecture</p>
                          <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM • Room 101</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Database Systems - Lab</p>
                          <p className="text-xs text-muted-foreground">11:00 AM - 12:30 PM • Lab 205</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Computer Networks - Lecture</p>
                          <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM • Room 301</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your latest academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentGrades && stats.recentGrades.length > 0 ? (
                    stats.recentGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{grade.subject}</p>
                          <p className="text-xs text-muted-foreground">{grade.course}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold ${
                              grade.grade.startsWith("A")
                                ? "text-green-600"
                                : grade.grade.startsWith("B")
                                  ? "text-blue-600"
                                  : "text-orange-600"
                            }`}
                          >
                            {grade.grade}
                          </p>
                          <p className="text-xs text-muted-foreground">{grade.score}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Data Structures - Final</p>
                          <p className="text-xs text-muted-foreground">CS301</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">A</p>
                          <p className="text-xs text-muted-foreground">88/100</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Database Systems - Midterm</p>
                          <p className="text-xs text-muted-foreground">CS302</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">A-</p>
                          <p className="text-xs text-muted-foreground">85/100</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Computer Networks - Quiz</p>
                          <p className="text-xs text-muted-foreground">CS303</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-blue-600">B+</p>
                          <p className="text-xs text-muted-foreground">82/100</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, UserCheck, Calendar, FileText, Clock } from "lucide-react"
import { ApiService } from "@/lib/api"

interface StaffDashboardStats {
  totalStudents: number
  averageAttendance: number
  upcomingExams: number
  pendingGrades: number
  classesToday: number
  todaySchedule?: Array<{
    id: string
    subject: string
    class: string
    time: string
    room: string
    type: string
  }>
  recentActivities?: Array<{
    id: string
    activity: string
    details: string
  }>
}

export default function StaffDashboard() {
  const [stats, setStats] = useState<StaffDashboardStats>({
    totalStudents: 0,
    averageAttendance: 0,
    upcomingExams: 0,
    pendingGrades: 0,
    classesToday: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const staffStats = await ApiService.getStaffStats()
      setStats(staffStats)
    } catch (error) {
      console.error("Failed to load staff dashboard data:", error)
      setStats({
        totalStudents: 85,
        averageAttendance: 78,
        upcomingExams: 3,
        pendingGrades: 12,
        classesToday: 4,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="staff" currentPath="/dashboard/staff" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Staff Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your classes, students, and academic activities.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="My Students"
              value={stats.totalStudents}
              description="Across all classes"
              icon={GraduationCap}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Avg. Attendance"
              value={`${stats.averageAttendance}%`}
              description="This semester"
              icon={UserCheck}
              trend={{ value: -2, isPositive: false }}
            />
            <StatsCard
              title="Upcoming Exams"
              value={stats.upcomingExams}
              description="Next 2 weeks"
              icon={Calendar}
              trend={{ value: 1, isPositive: true }}
            />
            <StatsCard
              title="Pending Grades"
              value={stats.pendingGrades}
              description="To be submitted"
              icon={FileText}
            />
            <StatsCard title="Classes Today" value={stats.classesToday} description="Scheduled sessions" icon={Clock} />
          </div>

          {/* Quick Actions and Schedule */}
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
                            schedule.type === "lecture"
                              ? "bg-blue-500"
                              : schedule.type === "lab"
                                ? "bg-green-500"
                                : schedule.type === "tutorial"
                                  ? "bg-orange-500"
                                  : "bg-purple-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {schedule.subject} - {schedule.class}
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
                          <p className="text-sm font-medium">Data Structures - CS 2024</p>
                          <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM • Room 101</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Database Systems - CS 2023</p>
                          <p className="text-xs text-muted-foreground">11:00 AM - 12:30 PM • Room 205</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Computer Networks - CS 2024</p>
                          <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM • Room 301</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Office Hours</p>
                          <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM • Office 402</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your recent academic activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{activity.activity}</span>
                        <span className="text-sm text-muted-foreground">{activity.details}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Attendance Submitted</span>
                        <span className="text-sm text-muted-foreground">CS 2024 - Data Structures</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Grades Uploaded</span>
                        <span className="text-sm text-muted-foreground">CS 2023 - Midterm Exam</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Exam Scheduled</span>
                        <span className="text-sm text-muted-foreground">Database Systems - Feb 17</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Students Added</span>
                        <span className="text-sm text-muted-foreground">5 new students via Excel</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

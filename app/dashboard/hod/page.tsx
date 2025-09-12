"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, TrendingUp, Calendar, Award } from "lucide-react"
import { ApiService } from "@/lib/api"

interface HODDashboardStats {
  totalStudents: number
  totalStaff: number
  totalSubjects: number
  averageAttendance: number
  averageGPA: number
  studentsAtRisk?: number
  highPerformers?: number
  staffSatisfaction?: number
  courseCompletion?: number
  recentActivities?: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export default function HODDashboard() {
  const [stats, setStats] = useState<HODDashboardStats>({
    totalStudents: 0,
    totalStaff: 0,
    totalSubjects: 0,
    averageAttendance: 0,
    averageGPA: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const hodStats = await ApiService.getHODStats()
      setStats(hodStats)
    } catch (error) {
      console.error("Failed to load HOD dashboard data:", error)
      setStats({
        totalStudents: 145,
        totalStaff: 12,
        totalSubjects: 18,
        averageAttendance: 78,
        averageGPA: 3.2,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="hod" currentPath="/dashboard/hod" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">HOD Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your department's performance.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Students"
              value={stats.totalStudents}
              description="Enrolled in department"
              icon={GraduationCap}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Staff Members"
              value={stats.totalStaff}
              description="Teaching faculty"
              icon={Users}
              trend={{ value: 2, isPositive: true }}
            />
            <StatsCard
              title="Subjects"
              value={stats.totalSubjects}
              description="Active courses"
              icon={BookOpen}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Avg. Attendance"
              value={`${stats.averageAttendance}%`}
              description="Department average"
              icon={TrendingUp}
              trend={{ value: -3, isPositive: false }}
            />
            <StatsCard
              title="Avg. GPA"
              value={stats.averageGPA.toFixed(1)}
              description="Out of 4.0"
              icon={Award}
              trend={{ value: 4, isPositive: true }}
            />
          </div>

          {/* Quick Actions and Recent Activities */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest department activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "subject"
                              ? "bg-green-500"
                              : activity.type === "meeting"
                                ? "bg-blue-500"
                                : "bg-orange-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New subject added</p>
                          <p className="text-xs text-muted-foreground">Machine Learning - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Staff meeting scheduled</p>
                          <p className="text-xs text-muted-foreground">Tomorrow at 10:00 AM - 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Attendance report generated</p>
                          <p className="text-xs text-muted-foreground">Monthly report - 6 hours ago</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Students at Risk</span>
                    <span className="text-sm text-red-600">
                      {stats.studentsAtRisk
                        ? `${stats.studentsAtRisk} (${((stats.studentsAtRisk / stats.totalStudents) * 100).toFixed(1)}%)`
                        : "12 (8.3%)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Performers</span>
                    <span className="text-sm text-green-600">
                      {stats.highPerformers
                        ? `${stats.highPerformers} (${((stats.highPerformers / stats.totalStudents) * 100).toFixed(0)}%)`
                        : "45 (31%)"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Staff Satisfaction</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.staffSatisfaction ? `${stats.staffSatisfaction}/5.0` : "4.2/5.0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Course Completion</span>
                    <span className="text-sm text-green-600">
                      {stats.courseCompletion ? `${stats.courseCompletion}%` : "94%"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, GraduationCap, UserCheck, TrendingUp, Calendar } from "lucide-react"
import { ApiService } from "@/lib/api"

interface DashboardStats {
  totalColleges: number
  totalDepartments: number
  totalStaff: number
  totalStudents: number
  totalHODs: number
  activeUsers?: number
  systemUptime?: string
  dataStorage?: string
  pendingApprovals?: number
  recentActivities?: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
}

export default function PrincipalDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalColleges: 0,
    totalDepartments: 0,
    totalStaff: 0,
    totalStudents: 0,
    totalHODs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const principalStats = await ApiService.getPrincipalStats()
      setStats(principalStats)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      try {
        const colleges = await ApiService.getAllColleges()
        const hods = await ApiService.getAllHODs()

        setStats({
          totalColleges: colleges.length,
          totalDepartments: colleges.reduce((acc: number, college: any) => acc + (college.departmentCount || 0), 0),
          totalStaff: 150,
          totalStudents: 2500,
          totalHODs: hods.length,
        })
      } catch (fallbackError) {
        console.error("Fallback data loading failed:", fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="principal" currentPath="/dashboard/principal" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">Principal Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your college management system.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Colleges"
              value={stats.totalColleges}
              description="Registered institutions"
              icon={Building2}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Departments"
              value={stats.totalDepartments}
              description="Academic departments"
              icon={UserCheck}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Staff Members"
              value={stats.totalStaff}
              description="Teaching & non-teaching"
              icon={Users}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Students"
              value={stats.totalStudents}
              description="Enrolled students"
              icon={GraduationCap}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard title="HODs" value={stats.totalHODs} description="Department heads" icon={TrendingUp} />
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivities && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "department"
                              ? "bg-green-500"
                              : activity.type === "hod"
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
                          <p className="text-sm font-medium">New department added</p>
                          <p className="text-xs text-muted-foreground">Computer Science - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">HOD assigned</p>
                          <p className="text-xs text-muted-foreground">Dr. Smith to Mathematics - 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New staff registered</p>
                          <p className="text-xs text-muted-foreground">5 new staff members - 6 hours ago</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Users</span>
                    <span className="text-sm text-muted-foreground">{stats.activeUsers || "2,847"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm text-green-600">{stats.systemUptime || "99.9%"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Storage</span>
                    <span className="text-sm text-muted-foreground">{stats.dataStorage || "78% used"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending Approvals</span>
                    <span className="text-sm text-orange-600">{stats.pendingApprovals || "12"}</span>
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

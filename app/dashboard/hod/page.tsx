"use client"

import { useEffect, useState } from "react"

import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, TrendingUp, Calendar, Award, CheckCircle, AlertTriangle } from "lucide-react"
import { ApiService } from "@/lib/api"
import { HodDashboardStats } from "@/lib/types" // MODIFIED: Import from lib/types
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export default function HODDashboard() {
    // MODIFIED: Use the imported HodDashboardStats type directly
    const [stats, setStats] = useState<HodDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const hodStats = await ApiService.getHODStats();
                setStats(hodStats);
            } catch (error: any) {
                console.error("Failed to load HOD dashboard data:", error);
                toast.error("Failed to load dashboard data", {
                    description: error.message || "Please check your connection and try again.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return <HODDashboardSkeleton />;
    }

    if (!stats) {
        return (
            <div className="p-4 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>
                            The dashboard data could not be loaded. Please try refreshing the page.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const getActivityIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case "subject added":
                return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
            case "attendance marked":
                return <div className="w-2 h-2 bg-green-500 rounded-full" />;
            default:
                return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
        }
    };

    return (
        <div className="p-4 lg:p-6 space-y-6 animate-fade-in pt-16 lg:pt-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">HOD Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's an overview of your department's performance.
                </p>
            </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            description="Enrolled in department"
                            icon={GraduationCap}
                        />
                        <StatsCard
                            title="Staff Members"
                            value={stats.totalStaff}
                            description="Teaching faculty"
                            icon={Users}
                        />
                        <StatsCard
                            title="Subjects"
                            value={stats.totalSubjects}
                            description="Active courses"
                            icon={BookOpen}
                        />
                        <StatsCard
                            title="Avg. Attendance"
                            value={`${stats.averageAttendance.toFixed(1)}%`}
                            description="Department average"
                            icon={TrendingUp}
                        />
                        <StatsCard
                            title="Avg. GPA"
                            value={stats.averageGPA.toFixed(1)}
                            description="Out of 4.0"
                            icon={Award}
                        />
                    </div>

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
                                {/* MODIFIED: Render dynamic activities */}
                                <div className="space-y-4">
                                    {stats.recentActivities && stats.recentActivities.length > 0 ? (
                                        stats.recentActivities.map((activity) => (
                                            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                                {getActivityIcon(activity.type)}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{activity.message}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No recent activities to display.
                                        </p>
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
                                {/* MODIFIED: Render dynamic performance data */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-red-500"/>Students at Risk</span>
                                        <span className="text-sm font-semibold text-red-500">
                                            {stats.studentsAtRisk ?? 0}
                                            {(stats.totalStudents > 0 && stats.studentsAtRisk != null) &&
                                                ` (${((stats.studentsAtRisk / stats.totalStudents) * 100).toFixed(1)}%)`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-2"><Award className="h-4 w-4 text-green-500"/>High Performers</span>
                                        <span className="text-sm font-semibold text-green-500">
                                            {stats.highPerformers ?? 0}
                                            {(stats.totalStudents > 0 && stats.highPerformers != null) &&
                                                ` (${((stats.highPerformers / stats.totalStudents) * 100).toFixed(1)}%)`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-blue-500"/>Course Completion</span>
                                        <span className="text-sm font-semibold text-blue-500">
                                            {stats.courseCompletion != null ? `${stats.courseCompletion.toFixed(1)}%` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
    );
}

const HODDashboardSkeleton = () => (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in pt-16 lg:pt-6">
        <div>
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 mt-2 rounded-lg" />
        </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-2/3 rounded-md" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-7 w-1/3 rounded-md" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-8 w-full rounded-lg" />
                            <Skeleton className="h-8 w-full rounded-lg" />
                        </CardContent>
                    </Card>
                </div>
            </div>
);
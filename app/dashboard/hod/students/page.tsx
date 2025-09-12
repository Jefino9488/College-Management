"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { StudentPerformance } from "@/components/hod/student-performance"

export default function StudentsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="hod" currentPath="/dashboard/hod/students" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Student Performance</h1>
            <p className="text-muted-foreground">Monitor and analyze student academic performance and attendance.</p>
          </div>

          <StudentPerformance />
        </div>
      </main>
    </div>
  )
}

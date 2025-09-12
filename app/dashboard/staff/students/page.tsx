"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { StudentManagement } from "@/components/staff/student-management"

export default function StudentsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="staff" currentPath="/dashboard/staff/students" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Student Management</h1>
            <p className="text-muted-foreground">Manage students, upload data, and track academic performance.</p>
          </div>

          <StudentManagement />
        </div>
      </main>
    </div>
  )
}

"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { SubjectManagement } from "@/components/hod/subject-management"

export default function SubjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="hod" currentPath="/dashboard/hod/subjects" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Subject Management</h1>
            <p className="text-muted-foreground">Manage subjects and curriculum for your department.</p>
          </div>

          <SubjectManagement />
        </div>
      </main>
    </div>
  )
}

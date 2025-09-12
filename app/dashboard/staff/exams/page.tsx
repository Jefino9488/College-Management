"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { ExamScheduler } from "@/components/staff/exam-scheduler"

export default function ExamsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="staff" currentPath="/dashboard/staff/exams" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Exam Management</h1>
            <p className="text-muted-foreground">Schedule and manage exams for your classes.</p>
          </div>

          <ExamScheduler />
        </div>
      </main>
    </div>
  )
}

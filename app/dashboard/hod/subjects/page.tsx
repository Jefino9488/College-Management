"use client"


import { SubjectManagement } from "@/components/hod/subject-management"

export default function SubjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Subject Management</h1>
        <p className="text-muted-foreground">Manage subjects and curriculum for your department.</p>
      </div>

      <SubjectManagement />
    </div>
  )
}

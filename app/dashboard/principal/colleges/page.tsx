"use client"


import { CollegeManagement } from "@/components/principal/college-management"

export default function CollegesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Colleges & Departments</h1>
        <p className="text-muted-foreground">Manage colleges, departments, and organizational structure.</p>
      </div>

      <CollegeManagement />
    </div>
  )
}

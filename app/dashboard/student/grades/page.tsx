"use client"


import { GradesOverview } from "@/components/student/grades-overview"

export default function GradesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Academic Performance</h1>
        <p className="text-muted-foreground">View your grades, GPA, and academic progress.</p>
      </div>

      <GradesOverview />
    </div>
  )
}

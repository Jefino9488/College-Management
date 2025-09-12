"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { StaffOverview } from "@/components/hod/staff-overview"

export default function StaffPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="hod" currentPath="/dashboard/hod/staff" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Staff Management</h1>
            <p className="text-muted-foreground">Overview and management of department staff members.</p>
          </div>

          <StaffOverview />
        </div>
      </main>
    </div>
  )
}

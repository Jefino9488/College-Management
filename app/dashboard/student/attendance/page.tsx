"use client"


import { AttendanceView } from "@/components/student/attendance-view"

export default function AttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Attendance Overview</h1>
        <p className="text-muted-foreground">Track your class attendance and maintain academic requirements.</p>
      </div>

      <AttendanceView />
    </div>
  )
}

"use client"


import { AttendanceTracker } from "@/components/staff/attendance-tracker"

export default function AttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Attendance Management</h1>
        <p className="text-muted-foreground">Record and track student attendance for your classes.</p>
      </div>

      <AttendanceTracker />
    </div>
  )
}

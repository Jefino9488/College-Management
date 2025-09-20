"use client"


import { ScheduleView } from "@/components/student/schedule-view"

export default function SchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Class Schedule</h1>
        <p className="text-muted-foreground">View your class timetable, exams, and assignment deadlines.</p>
      </div>

      <ScheduleView />
    </div>
  )
}

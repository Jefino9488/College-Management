"use client"


import { FeeManagement } from "@/components/student/fee-management"

export default function FeesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Fee Management</h1>
        <p className="text-muted-foreground">View your fee status, payment history, and make payments.</p>
      </div>

      <FeeManagement />
    </div>
  )
}

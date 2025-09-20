"use client"


import { StaffManagement } from "@/components/principal/staff-management"

export default function StaffPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">Staff Management</h1>
                <p className="text-muted-foreground">
                    View, add, and manage staff members and HODs across your college.
                </p>
            </div>
            <StaffManagement />
        </div>
    )
}
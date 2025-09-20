import { StaffOverview } from "@/components/hod/staff-overview";

export default function StaffPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">Staff Management</h1>
                <p className="text-muted-foreground">
                    Overview and management of department staff members.
                </p>
            </div>

            <StaffOverview />
        </div>
    );
}
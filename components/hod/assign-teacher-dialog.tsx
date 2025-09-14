"use client";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiService } from "@/lib/api";
import { toast } from "sonner";
import { Label } from "../ui/label";

interface AssignTeacherDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subject: { id: string; name: string } | null;
    onSuccess: () => void;
}

interface StaffMember {
    id: string;
    name: string; // Combined first and last name
}

export function AssignTeacherDialog({ open, onOpenChange, subject, onSuccess }: AssignTeacherDialogProps) {
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchStaff = async () => {
                try {
                    // MODIFIED: Use the correct API call that fetches staff for the current HOD's department
                    const staff = await ApiService.getHodStaff();
                    setStaffList(staff);
                } catch (error: any) {
                    toast.error("Failed to fetch staff list", { description: error.message });
                }
            };
            fetchStaff();
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!selectedTeacherId || !subject) {
            toast.warning("Please select a teacher to assign.");
            return;
        }
        setLoading(true);
        try {
            await ApiService.assignTeacherToSubject(subject.id, selectedTeacherId);
            toast.success(`Teacher assigned to ${subject.name} successfully!`);
            onSuccess();
        } catch (error: any) {
            toast.error("Failed to assign teacher", { description: error.message });
        } finally {
            setLoading(false);
            onOpenChange(false);
        }
    };

    if (!subject) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Teacher to {subject.name}</DialogTitle>
                    <DialogDescription>
                        Select a staff member from your department to assign as the teacher for this subject.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="teacher-select">Available Teachers</Label>
                    <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                        <SelectTrigger id="teacher-select">
                            <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                            {staffList.map((staff) => (
                                <SelectItem key={staff.id} value={staff.id.toString()}>
                                    {staff.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Assigning..." : "Assign Teacher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
// src/components/principal/college-management.tsx

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ApiService } from "@/lib/api";
import { Building2, Plus, Users } from "lucide-react";

interface College {
    id: string;
    name: string;
    address: string;
    departmentCount: number;
}

interface Department {
    id: string;
    name: string;
    code: string;
    hodName?: string;
    studentCount: number;
    staffCount: number;
}

interface HOD {
    id: string;
    name: string;
    email: string;
}

export function CollegeManagement() {
    const [colleges, setColleges] = useState<College[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [hods, setHODs] = useState<HOD[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [collegeForm, setCollegeForm] = useState({ name: "", address: "", contactEmail: "", phoneNumber: "" });
    const [departmentForm, setDepartmentForm] = useState({ name: "", code: "", collegeId: "" });
    const [hodAssignment, setHodAssignment] = useState({ departmentId: "", hodId: "" });

    useEffect(() => {
        loadColleges();
        loadHODs();
    }, []);

    useEffect(() => {
        if (selectedCollege) {
            loadDepartments(selectedCollege);
        }
    }, [selectedCollege]);

    const loadColleges = async () => {
        try {
            const data = await ApiService.getAllColleges();
            setColleges(data);
        } catch (err) {
            setError("Failed to load colleges");
        }
    };

    const loadDepartments = async (collegeId: string) => {
        try {
            const data = await ApiService.getDepartments(collegeId);
            setDepartments(data);
        } catch (err) {
            setError("Failed to load departments");
        }
    };

    const loadHODs = async () => {
        try {
            const data = await ApiService.getAllHODs();
            setHODs(data);
        } catch (err) {
            setError("Failed to load HODs");
        }
    };

    const handleCreateCollege = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ApiService.registerCollege({ ...collegeForm, contactEmail: "temp@temp.com", phoneNumber: "1234567890" });
            setCollegeForm({ name: "", address: "" });
            loadColleges();
        } catch (err) {
            setError("Failed to create college");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Use a null check to prevent the crash
        const deptExists = departments.some(
            (dept) => (dept.code?.toLowerCase() || '') === departmentForm.code.toLowerCase()
        );

        if (deptExists) {
            setError("A department with this code already exists in the college.");
            setLoading(false);
            return;
        }

        try {
            await ApiService.addDepartment(departmentForm);
            setDepartmentForm({ name: "", code: "", collegeId: "" });
            if (selectedCollege) {
                await loadDepartments(selectedCollege);
            }
        } catch (err) {
            setError("Failed to create department. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignHOD = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ApiService.assignHOD(hodAssignment.departmentId, hodAssignment.hodId);
            setHodAssignment({ departmentId: "", hodId: "" });
            if (selectedCollege) {
                loadDepartments(selectedCollege);
            }
        } catch (err) {
            setError("Failed to assign HOD");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* College Management */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                College Management
                            </CardTitle>
                            <CardDescription>Manage colleges and their departments</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add College
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Register New College</DialogTitle>
                                    <DialogDescription>Add a new college to the system</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateCollege} className="space-y-4">
                                    <div>
                                        <Label htmlFor="collegeName">College Name</Label>
                                        <Input
                                            id="collegeName"
                                            value={collegeForm.name}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="collegeAddress">Address</Label>
                                        <Input
                                            id="collegeAddress"
                                            value={collegeForm.address}
                                            onChange={(e) => setCollegeForm({ ...collegeForm, address: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? "Creating..." : "Create College"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {colleges.map((college) => (
                            <Card
                                key={college.id}
                                className={`cursor-pointer transition-colors ${
                                    selectedCollege === college.id ? "ring-2 ring-primary" : ""
                                }`}
                                onClick={() => setSelectedCollege(college.id)}
                            >
                                <CardContent className="p-4">
                                    <h3 className="font-semibold">{college.name}</h3>
                                    <p className="text-sm text-muted-foreground">{college.address}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">{college.departmentCount} Departments</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Department Management */}
            {selectedCollege && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Department Management</CardTitle>
                                <CardDescription>Manage departments for the selected college</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Department
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Department</DialogTitle>
                                            <DialogDescription>Create a new department</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreateDepartment} className="space-y-4">
                                            <div>
                                                <Label htmlFor="departmentName">Department Name</Label>
                                                <Input
                                                    id="departmentName"
                                                    value={departmentForm.name}
                                                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="departmentCode">Department Code</Label>
                                                <Input
                                                    id="departmentCode"
                                                    value={departmentForm.code}
                                                    onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value })}
                                                    required
                                                    placeholder="e.g., CSE, ECE"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                onClick={() => setDepartmentForm({ ...departmentForm, collegeId: selectedCollege })}
                                            >
                                                {loading ? "Creating..." : "Create Department"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Users className="h-4 w-4 mr-2" />
                                            Assign HOD
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Assign Head of Department</DialogTitle>
                                            <DialogDescription>Assign an HOD to a department</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleAssignHOD} className="space-y-4">
                                            <div>
                                                <Label htmlFor="department">Department</Label>
                                                <Select
                                                    value={hodAssignment.departmentId}
                                                    onValueChange={(value) => setHodAssignment({ ...hodAssignment, departmentId: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {departments.map((dept) => (
                                                            <SelectItem key={dept.id} value={dept.id}>
                                                                {dept.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="hod">HOD</Label>
                                                <Select
                                                    value={hodAssignment.hodId}
                                                    onValueChange={(value) => setHodAssignment({ ...hodAssignment, hodId: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select HOD" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {hods.map((hod) => (
                                                            <SelectItem key={hod.id} value={hod.id}>
                                                                {hod.name} ({hod.email})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? "Assigning..." : "Assign HOD"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {departments.map((department) => (
                                <Card key={department.id}>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold">{department.name}</h3>
                                        <p className="text-sm text-muted-foreground">Code: {department.code}</p>
                                        {department.hodName && <p className="text-sm text-muted-foreground">HOD: {department.hodName}</p>}
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{department.studentCount} Students</Badge>
                                            <Badge variant="outline">{department.staffCount} Staff</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
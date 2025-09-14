"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/lib/api"
import { BookOpen, Plus, Clock, Users, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { AssignTeacherDialog } from "./assign-teacher-dialog" // ADDED

interface Subject {
    id: string
    name: string
    code: string
    credits: number
    semester: number
    year: number
    enrolledStudents: number
    assignedTeacher?: string
}

export function SubjectManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [subjectForm, setSubjectForm] = useState({
        name: "",
        code: "",
        credits: 0,
        semester: 1,
        year: 1,
    })
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);

    // ADDED: State for the assignment dialog
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [subjectToAssign, setSubjectToAssign] = useState<Subject | null>(null);

    useEffect(() => {
        loadSubjects()
    }, [])

    const loadSubjects = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getSubjects();
            setSubjects(data);
        } catch (err: any) {
            setError(err.message || "Failed to load subjects");
        } finally {
            setLoading(false);
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            if (editingSubject) {
                await ApiService.updateSubject(editingSubject.id, subjectForm);
                toast.success("Subject updated successfully!");
            } else {
                await ApiService.addSubject(subjectForm);
                toast.success("Subject added successfully!");
            }
            setIsAddEditDialogOpen(false);
            setEditingSubject(null);
            loadSubjects();
        } catch (err: any) {
            toast.error("Failed to Save Subject", {
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    }

    const openEditDialog = (subject: Subject) => {
        setEditingSubject(subject);
        setSubjectForm({
            name: subject.name,
            code: subject.code,
            credits: subject.credits,
            semester: subject.semester,
            year: subject.year,
        });
        setIsAddEditDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingSubject(null);
        setSubjectForm({ name: "", code: "", credits: 0, semester: 1, year: 1 });
        setIsAddEditDialogOpen(true);
    };

    // ADDED: Handler to open the assignment dialog
    const openAssignDialog = (subject: Subject) => {
        setSubjectToAssign(subject);
        setIsAssignDialogOpen(true);
    };

    const handleDeleteSubject = async (subjectId: string) => {
        try {
            await ApiService.deleteSubject(subjectId);
            toast.success("Subject deleted successfully!");
            setSubjects(subjects.filter(s => s.id !== subjectId));
        } catch (error: any) {
            toast.error("Failed to delete subject", { description: error.message });
        }
    };

    const dialogTitle = editingSubject ? "Edit Subject" : "Add New Subject";
    const dialogDescription = editingSubject ? "Update the details for this subject." : "Create a new subject for the department";
    const buttonText = editingSubject ? "Save Changes" : "Add Subject";
    const loadingText = editingSubject ? "Saving..." : "Adding...";

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Subject Management
                            </CardTitle>
                            <CardDescription>Manage subjects and curriculum for your department</CardDescription>
                        </div>
                        <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openAddDialog}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{dialogTitle}</DialogTitle>
                                    <DialogDescription>{dialogDescription}</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="subjectName">Subject Name</Label>
                                        <Input
                                            id="subjectName"
                                            value={subjectForm.name}
                                            onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                                            required
                                            placeholder="e.g., Data Structures and Algorithms"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="subjectCode">Subject Code</Label>
                                        <Input
                                            id="subjectCode"
                                            value={subjectForm.code}
                                            onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                                            required
                                            placeholder="e.g., CS301"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="credits">Credits</Label>
                                        <Input
                                            id="credits"
                                            type="number"
                                            value={subjectForm.credits}
                                            onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number.parseInt(e.target.value) || 0 })}
                                            required
                                            min="1"
                                            max="6"
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? loadingText : buttonText}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                            <Card key={subject.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-lg">{subject.name}</h3>
                                            <p className="text-sm text-muted-foreground">{subject.code}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {subject.credits} Credits
                                            </Badge>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {subject.enrolledStudents} Students
                                            </Badge>
                                        </div>
                                        {subject.assignedTeacher && (
                                            <p className="text-sm">
                                                <span className="font-medium">Teacher:</span> {subject.assignedTeacher}
                                            </p>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            {/* ADDED: Assign Teacher Button */}
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openAssignDialog(subject)}>
                                                <UserPlus className="h-4 w-4 mr-2" /> Assign
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(subject)}>
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the subject "{subject.name}".
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ADDED: Integrated AssignTeacherDialog */}
            <AssignTeacherDialog
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
                subject={subjectToAssign}
                onSuccess={() => {
                    setIsAssignDialogOpen(false);
                    loadSubjects();
                }}
            />
        </div>
    )
}
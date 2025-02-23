// src/pages/Departments.tsx
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchDepartments, createDepartment, DepartmentDTO, Department } from "@/lib/api";

const departmentSchema = z.object({
    code: z.string().min(1, "Department code is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    totalYears: z.number().min(1, "Total years must be at least 1"),
    semestersPerYear: z.number().min(1, "Semesters per year must be at least 1"),
    collegeId: z.number().min(1, "College ID is required"),
});

export default function Departments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState<string>("");

    const authResponse = JSON.parse(localStorage.getItem("authResponse") || "{}");
    const collegeId = 1;

    const form = useForm<DepartmentDTO>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            totalYears: 4,
            semestersPerYear: 2,
            collegeId: collegeId,
        },
    });

    // Fetch departments on mount
    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const response = await fetchDepartments(collegeId);
                setDepartments(response.data); // Assuming response.data is an array of Department
            } catch (err) {
                setError("Failed to fetch departments.");
            }
        };
        loadDepartments();
    }, [collegeId]);

    const onSubmit = async (data: DepartmentDTO) => {
        try {
            const response = await createDepartment(data);
            setDepartments([...departments, response.data]); // Add new department to list
            form.reset(); // Reset form
            setError("");
        } catch (err) {
            setError("Failed to create department.");
        }
    };

    return (
        <div className="container mx-auto p-4 bg-[--color-background]">
            <Card>
                <CardHeader>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>Manage departments for your college</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Departments Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Total Years</TableHead>
                                <TableHead>Semesters/Year</TableHead>
                                <TableHead>HOD</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.map((dept) => (
                                <TableRow key={dept.id}>
                                    <TableCell>{dept.code}</TableCell>
                                    <TableCell>{dept.name}</TableCell>
                                    <TableCell>{dept.description}</TableCell>
                                    <TableCell>{dept.totalYears}</TableCell>
                                    <TableCell>{dept.semestersPerYear}</TableCell>
                                    <TableCell>
                                        {dept.hod ? `${dept.hod.firstName} ${dept.hod.lastName}` : "Not Assigned"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Error Message */}
                    {error && <p className="text-[--color-destructive] mt-4">{error}</p>}

                    {/* Add Department Form */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Add New Department</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., CSE"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Computer Science"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Department of Computer Science and Engineering"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="totalYears"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Years</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 4"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="semestersPerYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semesters Per Year</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 2"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Add Department
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
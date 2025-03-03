import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerCollege, CollegeRegistrationDTO, AuthenticationResponseDTO } from "@/lib/api";

const collegeSchema = z.object({
    name: z.string().min(1, "College name is required"),
    address: z.string().min(1, "Address is required"),
    contactEmail: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

interface CollegeManagementProps {
    user: AuthenticationResponseDTO | null;
}

export default function CollegeManagement({ user }: CollegeManagementProps) {
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const form = useForm<CollegeRegistrationDTO>({
        resolver: zodResolver(collegeSchema),
        defaultValues: {
            name: "",
            address: "",
            contactEmail: "",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        if (user?.role !== "PRINCIPAL") {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const onSubmit = async (data: CollegeRegistrationDTO) => {
        try {
            await registerCollege(data);
            setError("");
            window.location.reload(); // Refresh to update college info in auth response
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to register college");
        }
    };

    return (
        <div className="container mx-auto p-4 bg-[--color-background]">
            <Card>
                <CardHeader>
                    <CardTitle>College Management</CardTitle>
                    <CardDescription>Register or view your college</CardDescription>
                </CardHeader>
                <CardContent>
                    {user?.collegeName ? (
                        <div>
                            <h3 className="text-lg font-semibold">Your College</h3>
                            <p>Name: {user.collegeName}</p>
                            <p>ID: {user.collegeId}</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Register New College</h3>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>College Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">Register College</Button>
                                </form>
                            </Form>
                            {error && <p className="text-[--color-destructive] mt-4">{error}</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
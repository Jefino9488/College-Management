// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { registerEmailValidation, registerUser, RegistrationRequestDTO } from "@/lib/api";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Please select a gender" }),
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT", "STAFF", "HOD", "PRINCIPAL"], { message: "Please select a role" }),
    department: z.string().min(1, "Department code is required"),
    academicYear: z.string().min(4, "Academic year must be at least 4 characters"),
    activationCode: z.string().min(6, "Activation code must be 6 digits"),
});

export default function Register() {
    const [step, setStep] = useState<"email" | "form">("email");
    const navigate = useNavigate();

    const emailForm = useForm<{ email: string }>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    const registerForm = useForm<RegistrationRequestDTO>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "",
            mobileNumber: "",
            email: "",
            password: "",
            role: "",
            department: "",
            activationCode: "",
            academicYear: "",
        },
    });

    const handleEmailValidation = async (data: { email: string }) => {
        try {
            await registerEmailValidation(data.email);
            setStep("form");
            registerForm.setValue("email", data.email);
        } catch (err) {
            emailForm.setError("root", { message: "Email already exists or validation failed." });
        }
    };

    const handleRegister = async (data: RegistrationRequestDTO) => {
        try {
            await registerUser(data);
            navigate("/login");
        } catch (err) {
            registerForm.setError("root", { message: "Registration failed. Check your activation code." });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
                    <CardDescription className="text-center text-[--color-muted-foreground]">
                        {step === "email" ? "Validate your email first" : "Complete your registration"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <Form {...emailForm}>
                            <form onSubmit={emailForm.handleSubmit(handleEmailValidation)} className="space-y-6">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {emailForm.formState.errors.root && (
                                    <p className="text-[--color-destructive] text-sm">
                                        {emailForm.formState.errors.root.message}
                                    </p>
                                )}
                                <Button type="submit" className="w-full">
                                    Validate Email
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...registerForm}>
                            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-6">
                                <FormField
                                    control={registerForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your first name"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your last name"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[--color-background] text-[--color-foreground] border-[--color-border]">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="MALE">Male</SelectItem>
                                                    <SelectItem value="FEMALE">Female</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="Enter your mobile number"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Create a password"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[--color-background] text-[--color-foreground] border-[--color-border]">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="STUDENT">Student</SelectItem>
                                                    <SelectItem value="STAFF">Staff</SelectItem>
                                                    <SelectItem value="HOD">HOD</SelectItem>
                                                    <SelectItem value="PRINCIPAL">Principal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter department code (e.g., CSE)"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="academicYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter academic year (e.g., 2023)"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="activationCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Activation Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the 6-digit code sent to your email"
                                                    className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {registerForm.formState.errors.root && (
                                    <p className="text-[--color-destructive] text-sm">
                                        {registerForm.formState.errors.root.message}
                                    </p>
                                )}
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-[--color-muted-foreground]">
                        Already have an account?{" "}
                        <a href="/login" className="text-[--color-primary] hover:underline">
                            Login here
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
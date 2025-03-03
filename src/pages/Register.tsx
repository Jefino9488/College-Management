import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fetchColleges, registerEmailValidation, registerUser, RegistrationRequestDTO } from "@/lib/api";
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

// Define the schema to match RegistrationRequestDTO closely
const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Please select a gender" }),
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT", "STAFF", "HOD", "PRINCIPAL"], { message: "Please select a role" }),
    department: z.string().optional(),
    academicYear: z.string().optional(),
    activationCode: z.string().min(6, "Activation code must be 6 digits"),
    collegeId: z.number().optional(),
}).superRefine((data, ctx) => {
    // Use inferred type from schema instead of RegistrationRequestDTO
    const typedData = data as z.infer<typeof registerSchema>;
    if (["STUDENT", "STAFF", "HOD"].includes(typedData.role) && (!typedData.department || typedData.department.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Department is required for STUDENT, STAFF, and HOD roles",
            path: ["department"],
        });
    }
    if (typedData.role === "STUDENT" && (!typedData.academicYear || typedData.academicYear.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Academic year is required for STUDENT role",
            path: ["academicYear"],
        });
    }
    if (typedData.role !== "PRINCIPAL" && !typedData.collegeId) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "College ID is required for non-PRINCIPAL roles",
            path: ["collegeId"],
        });
    }
});

// Use inferred type from schema to avoid mismatch
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const [step, setStep] = useState<"email" | "form">("email");
    const [isRegistering, setIsRegistering] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [colleges, setColleges] = useState<{ id: number; name: string }[]>([]);
    const [isLoadingColleges, setIsLoadingColleges] = useState(true);
    const navigate = useNavigate();

    const emailForm = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: z.string().email("Invalid email address") })),
        defaultValues: { email: "" },
    });

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            gender: "" as "MALE" | "FEMALE" | "OTHER",
            mobileNumber: "",
            email: "",
            password: "",
            role: "" as "STUDENT" | "STAFF" | "HOD" | "PRINCIPAL",
            department: undefined,
            activationCode: "",
            academicYear: undefined,
            collegeId: undefined,
        },
    });

    useEffect(() => {
        const loadColleges = async () => {
            setIsLoadingColleges(true);
            try {
                const response = await fetchColleges();
                setColleges(
                    response.data.map((college: any) => ({
                        id: college.id,
                        name: college.name,
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch colleges:", err);
                setServerError("Failed to load colleges. Please try again.");
            } finally {
                setIsLoadingColleges(false);
            }
        };

        void loadColleges();
    }, []);

    const selectedRole = registerForm.watch("role");

    const handleEmailValidation = async (data: { email: string }) => {
        try {
            const response = await registerEmailValidation(data.email);
            if (response.data.status) {
                registerForm.reset({
                    firstName: "",
                    lastName: "",
                    gender: "" as "MALE" | "FEMALE" | "OTHER",
                    mobileNumber: "",
                    email: data.email,
                    password: "",
                    role: "" as "STUDENT" | "STAFF" | "HOD" | "PRINCIPAL",
                    department: undefined,
                    activationCode: "",
                    academicYear: undefined,
                    collegeId: undefined,
                });
                setStep("form");
                setServerError(null);
            } else {
                setServerError(response.data.message || "Email validation failed.");
            }
        } catch (err: any) {
            console.error("Email validation error:", err);
            setServerError(err.response?.data?.message || "Email validation failed. Check if it’s already registered.");
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setIsRegistering(true);
        setServerError(null);
        try {
            // Cast to RegistrationRequestDTO since the API expects it
            const response = await registerUser(data as RegistrationRequestDTO);
            if (response.data.status) {
                navigate("/login");
            } else {
                setServerError(response.data.message || "Registration failed.");
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setServerError(
                err.response?.data?.message || "Registration failed. Check your activation code or try again."
            );
        } finally {
            setIsRegistering(false);
        }
    };

    const formValues = registerForm.watch();
    const isFormValid = registerForm.formState.isValid;

    return (
        <Card className="max-w-lg mx-auto mt-10">
            <CardHeader>
                <CardTitle>{step === "email" ? "Validate Your Email" : "Complete Registration"}</CardTitle>
                <CardDescription>
                    {step === "email"
                        ? "Enter your email to receive an activation code."
                        : "Fill in your details to register."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {step === "email" ? (
                    <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(handleEmailValidation)} className="space-y-4">
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" autoComplete="email" placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {serverError && <p className="text-red-500">{serverError}</p>}
                            <Button type="submit" disabled={emailForm.formState.isSubmitting}>
                                {emailForm.formState.isSubmitting ? "Validating..." : "Validate Email"}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form key={registerForm.watch("email")} {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                            <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" autoComplete="given-name" placeholder="Enter your first name" {...field} />
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
                                            <Input type="text" autoComplete="family-name" placeholder="Enter your last name" {...field} />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your gender" />
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
                                            <Input type="tel" autoComplete="tel" placeholder="Enter your mobile number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" autoComplete="email" placeholder="Enter your email" {...field} readOnly />
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
                                            <Input type="password" placeholder="Enter your password" {...field} />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your role" />
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
                            {selectedRole !== "PRINCIPAL" && (
                                <FormField
                                    control={registerForm.control}
                                    name="collegeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>College</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value?.toString()}
                                                disabled={isLoadingColleges}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a college" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {colleges.map((college) => (
                                                        <SelectItem key={college.id} value={college.id.toString()}>
                                                            {college.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {["STUDENT", "STAFF", "HOD"].includes(selectedRole) && (
                                <FormField
                                    control={registerForm.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department Code</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="e.g., IT" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            {selectedRole === "STUDENT" && (
                                <FormField
                                    control={registerForm.control}
                                    name="academicYear"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="e.g., 2023" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={registerForm.control}
                                name="activationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Activation Code</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter the 6-digit code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {serverError && <p className="text-red-500">{serverError}</p>}
                            <div className="debug-info">
                                <p>Form Values: {JSON.stringify(formValues)}</p>
                                <p>Form Valid: {isFormValid.toString()}</p>
                                <p>Errors: {JSON.stringify(registerForm.formState.errors)}</p>
                            </div>
                            <Button type="submit" disabled={isRegistering || !isFormValid}>
                                {isRegistering ? "Registering..." : "Register"}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter>
                <p>
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login here
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}

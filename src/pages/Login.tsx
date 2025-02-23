// src/pages/Login.tsx
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
import { loginUser, AuthenticationRequestDTO, AuthenticationResponseDTO } from "@/lib/api";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginProps {
    setUser: (user: AuthenticationResponseDTO) => void;
}

export default function Login({ setUser }: LoginProps) {
    const navigate = useNavigate();
    const form = useForm<AuthenticationRequestDTO>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: AuthenticationRequestDTO) => {
        try {
            const response = await loginUser(data);
            localStorage.setItem("authResponse", JSON.stringify(response.data));
            setUser(response.data);
            navigate("/dashboard");
        } catch (err) {
            form.setError("root", { message: "Invalid credentials. Please try again." });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                    <CardDescription className="text-center text-[--color-muted-foreground]">
                        Sign in to your college management account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                className="bg-[--color-background] text-[--color-foreground] border-[--color-border]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {form.formState.errors.root && (
                                <p className="text-[--color-destructive] text-sm">
                                    {form.formState.errors.root.message}
                                </p>
                            )}
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-[--color-muted-foreground]">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-[--color-primary] hover:underline">
                            Register here
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
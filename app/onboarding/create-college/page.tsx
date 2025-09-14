"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiService } from "@/lib/api"
import { Building2 } from "lucide-react"
import { toast } from "sonner"

export default function CreateCollegePage() {
    const [collegeForm, setCollegeForm] = useState({
        name: "",
        address: "",
        contactEmail: "",
        phoneNumber: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await ApiService.registerCollege(collegeForm);
            router.push("/dashboard/principal");
        } catch (err: any) {
            // MODIFIED: Use toast for specific error feedback
            toast.error("College Registration Failed", {
                description: err.message,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Register Your College</CardTitle>
                    <CardDescription>
                        Welcome! Please enter your college's details to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="collegeName">College Name</Label>
                            <Input
                                id="collegeName"
                                value={collegeForm.name}
                                onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                                required
                                placeholder="e.g., Central Institute of Technology"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">College Address</Label>
                            <Input
                                id="address"
                                value={collegeForm.address}
                                onChange={(e) => setCollegeForm({ ...collegeForm, address: e.target.value })}
                                required
                                placeholder="e.g., 123 Education Drive, Knowledge City"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">Contact Email</Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                value={collegeForm.contactEmail}
                                onChange={(e) => setCollegeForm({ ...collegeForm, contactEmail: e.target.value })}
                                required
                                placeholder="e.g., admissions@cit.edu"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                value={collegeForm.phoneNumber}
                                onChange={(e) => setCollegeForm({ ...collegeForm, phoneNumber: e.target.value })}
                                required
                                placeholder="e.g., 9876543210"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save and Continue"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
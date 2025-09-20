"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Save } from "lucide-react";

export default function HODSettingsPage() {
    // Mock data - replace with API call
    const profile = {
        name: "Dr. Alan Grant",
        email: "alan.grant@university.edu",
        phone: "+1 (555) 111-2222",
        department: "Computer Science",
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and department preferences
                </p>
            </div>
            <Card className="max-w-3xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        HOD Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal and contact details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={profile.name} />
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" defaultValue={profile.department} disabled />
                        </div>
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={profile.email} />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue={profile.phone} />
                        </div>
                    </div>
                    <Button className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
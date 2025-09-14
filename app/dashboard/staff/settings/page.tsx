"use client"

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Save } from "lucide-react";

export default function StaffSettingsPage() {
    // Mock data - replace with API call
    const profile = {
        name: "Prof. Ian Malcolm",
        email: "ian.malcolm@university.edu",
        phone: "+1 (555) 333-4444",
        specialization: "Database Systems"
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar userRole="staff" currentPath="/dashboard/staff/settings" />
            <main className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Settings</h1>
                        <p className="text-muted-foreground">Manage your account preferences</p>
                    </div>
                    <Card className="max-w-3xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Staff Information
                            </CardTitle>
                            <CardDescription>Update your personal and contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={profile.name} />
                                </div>
                                <div>
                                    <Label htmlFor="specialization">Specialization</Label>
                                    <Input id="specialization" defaultValue={profile.specialization} />
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
            </main>
        </div>
    );
}
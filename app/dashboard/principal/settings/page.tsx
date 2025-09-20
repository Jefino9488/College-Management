"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, Save } from "lucide-react";

export default function PrincipalSettingsPage() {
    // Mock data - replace with API call
    const profile = {
        name: "Dr. Evelyn Reed",
        email: "principal.reed@university.edu",
        phone: "+1 (555) 987-6543",
        qualifications: "Ph.D. in Educational Leadership",
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account and institution settings
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Principal Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal and professional details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue={profile.name} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue={profile.email} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue={profile.phone} />
                                </div>
                                <div>
                                    <Label htmlFor="qualifications">Qualifications</Label>
                                    <Input
                                        id="qualifications"
                                        defaultValue={profile.qualifications}
                                    />
                                </div>
                            </div>
                            <Button className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security
                            </CardTitle>
                            <CardDescription>Manage your password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" type="password" />
                            </div>
                            <div>
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" type="password" />
                            </div>
                            <Button variant="outline" className="w-full bg-transparent">
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
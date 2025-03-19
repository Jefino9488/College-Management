"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { profileApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from "sonner"
import { Loader2, User } from "lucide-react"

export default function ProfilePage() {
    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <ProfileContent />
                </div>
                <Toaster position="top-right" richColors />
            </div>
        </AuthGuard>
    )
}

function ProfileContent() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [profile, setProfile] = useState<any>(null)
    const [formData, setFormData] = useState<any>({
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        bio: "",
        qualifications: "",
        github: "",
        certificates: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return

            setIsLoading(true)
            try {
                const response = await profileApi.getProfile(user.id)
                const profileData = response.data
                setProfile(profileData)
                setFormData({
                    firstName: profileData.firstName || "",
                    lastName: profileData.lastName || "",
                    email: profileData.email || "",
                    mobileNumber: profileData.mobileNumber || "",
                    bio: profileData.bio || "",
                    qualifications: profileData.qualifications || "",
                    github: profileData.github || "",
                    certificates: profileData.certificates || "",
                })
            } catch (error: any) {
                console.error("Error fetching profile:", error)
                toast.error("Error", {
                    description: "Failed to load profile data. Please try again.",
                    duration: 5000,
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let response

            // Map backend DTO fields to frontend formData
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobileNumber: formData.mobileNumber,
                ...(user?.role === "STUDENT" && {
                    github: formData.github,
                    certificates: formData.certificates,
                }),
                ...(user?.role === "STAFF" || user?.role === "HOD" || user?.role === "PRINCIPAL"
                    ? {
                        bio: formData.bio,
                        qualifications: formData.qualifications,
                    }
                    : {}),
            }

            if (user?.role === "STUDENT") {
                response = await profileApi.updateStudentProfile(updateData)
            } else if (user?.role === "STAFF" || user?.role === "HOD") {
                response = await profileApi.updateTeacherProfile(updateData)
            } else if (user?.role === "PRINCIPAL") {
                response = await profileApi.updatePrincipalProfile(updateData)
            }

            setProfile(response?.data || profile)
            setIsEditing(false)

            toast.success("Success", {
                description: "Profile updated successfully.",
                duration: 3000,
            })
        } catch (error: any) {
            console.error("Error updating profile:", error)
            toast.error("Error", {
                description: "Failed to update profile. Please try again.",
                duration: 5000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading && !profile) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">
                                {profile?.firstName} {profile?.lastName}
                            </h2>
                            <p className="text-sm text-muted-foreground">{user?.role}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        </div>
                    </CardContent>
                </Card>

                {isEditing ? (
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Edit Profile</CardTitle>
                                <CardDescription>Update your profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                                    <Input
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {(user?.role === "STAFF" || user?.role === "HOD" || user?.role === "PRINCIPAL") && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="qualifications">Qualifications</Label>
                                            <Textarea
                                                id="qualifications"
                                                name="qualifications"
                                                value={formData.qualifications}
                                                onChange={handleInputChange}
                                                rows={4}
                                            />
                                        </div>
                                    </>
                                )}

                                {user?.role === "STUDENT" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="github">GitHub Profile</Label>
                                            <Input
                                                id="github"
                                                name="github"
                                                value={formData.github}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="certificates">Certificates</Label>
                                            <Textarea
                                                id="certificates"
                                                name="certificates"
                                                value={formData.certificates}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="List your certificates and achievements"
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Your detailed information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="personal">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                    {user?.role === "STUDENT" && <TabsTrigger value="academic">Academic Info</TabsTrigger>}
                                    {(user?.role === "STAFF" || user?.role === "HOD" || user?.role === "PRINCIPAL") && (
                                        <TabsTrigger value="professional">Professional Info</TabsTrigger>
                                    )}
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                                            <p>{profile?.firstName || "N/A"}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                                            <p>{profile?.lastName || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                        <p>{profile?.email || "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Mobile Number</h3>
                                        <p>{profile?.mobileNumber || "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                                        <p>{user?.department || "N/A"}</p>
                                    </div>
                                </TabsContent>

                                {user?.role === "STUDENT" && (
                                    <TabsContent value="academic" className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Academic Year</h3>
                                            <p>{profile?.academicYear || "N/A"}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">GitHub Profile</h3>
                                            <p>{profile?.github || "N/A"}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Certificates</h3>
                                            <p className="whitespace-pre-line">{profile?.certificates || "N/A"}</p>
                                        </div>
                                    </TabsContent>
                                )}

                                {(user?.role === "STAFF" || user?.role === "HOD" || user?.role === "PRINCIPAL") && (
                                    <TabsContent value="professional" className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                                            <p className="whitespace-pre-line">{profile?.bio || "N/A"}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Qualifications</h3>
                                            <p className="whitespace-pre-line">{profile?.qualifications || "N/A"}</p>
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Palette, Save } from "lucide-react"
import { ApiService } from "@/lib/api"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  studentId: string
  department: string
  academicYear: string
  avatar?: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  gradeAlerts: boolean
  attendanceAlerts: boolean
  examReminders: boolean
  feeReminders: boolean
}

export default function StudentSettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    studentId: "",
    department: "",
    academicYear: "",
  })
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    gradeAlerts: true,
    attendanceAlerts: true,
    examReminders: true,
    feeReminders: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId") || "current-user"
      const profileData = await ApiService.getProfile(userId)
      setProfile(profileData)
    } catch (error) {
      console.error("Failed to load profile:", error)
      // Fallback to mock data
      setProfile({
        id: "student-123",
        name: "John Doe",
        email: "john.doe@university.edu",
        phone: "+1 (555) 123-4567",
        address: "123 University Ave, College Town, ST 12345",
        studentId: "CS2024001",
        department: "Computer Science",
        academicYear: "2024",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    setSaving(true)
    try {
      await ApiService.updateProfile(profile.id, profile, "student")
      // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input id="studentId" value={profile.studentId} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" value={profile.department} disabled className="bg-muted" />
                    </div>
                    <div>
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Input id="academicYear" value={profile.academicYear} disabled className="bg-muted" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handleProfileUpdate} disabled={saving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
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
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Academic Alerts</Label>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="gradeAlerts" className="text-sm">
                        Grade Updates
                      </Label>
                      <Switch
                        id="gradeAlerts"
                        checked={notifications.gradeAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("gradeAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="attendanceAlerts" className="text-sm">
                        Attendance Alerts
                      </Label>
                      <Switch
                        id="attendanceAlerts"
                        checked={notifications.attendanceAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("attendanceAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="examReminders" className="text-sm">
                        Exam Reminders
                      </Label>
                      <Switch
                        id="examReminders"
                        checked={notifications.examReminders}
                        onCheckedChange={(checked) => handleNotificationChange("examReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="feeReminders" className="text-sm">
                        Fee Reminders
                      </Label>
                      <Switch
                        id="feeReminders"
                        checked={notifications.feeReminders}
                        onCheckedChange={(checked) => handleNotificationChange("feeReminders", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize your interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Theme</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        Light
                      </Button>
                      <Button variant="outline" size="sm">
                        Dark
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      English (US)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    )
}

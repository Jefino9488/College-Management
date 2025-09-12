"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Building2,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  UserCheck,
  BookOpen,
  Calendar,
} from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface SidebarProps {
  userRole: "principal" | "hod" | "staff" | "student"
  currentPath?: string
}

const navigationItems = {
  principal: [
    { icon: BarChart3, label: "Overview", href: "/dashboard/principal" },
    { icon: Building2, label: "Colleges & Departments", href: "/dashboard/principal/colleges" },
    { icon: Users, label: "Staff Management", href: "/dashboard/principal/staff" },
    { icon: UserCheck, label: "HOD Management", href: "/dashboard/principal/hods" },
    { icon: Settings, label: "Settings", href: "/dashboard/principal/settings" },
  ],
  hod: [
    { icon: BarChart3, label: "Overview", href: "/dashboard/hod" },
    { icon: Users, label: "Staff", href: "/dashboard/hod/staff" },
    { icon: BookOpen, label: "Subjects", href: "/dashboard/hod/subjects" },
    { icon: GraduationCap, label: "Students", href: "/dashboard/hod/students" },
    { icon: Settings, label: "Settings", href: "/dashboard/hod/settings" },
  ],
  staff: [
    { icon: BarChart3, label: "Overview", href: "/dashboard/staff" },
    { icon: GraduationCap, label: "Students", href: "/dashboard/staff/students" },
    { icon: UserCheck, label: "Attendance", href: "/dashboard/staff/attendance" },
    { icon: Calendar, label: "Exams", href: "/dashboard/staff/exams" },
    { icon: Settings, label: "Settings", href: "/dashboard/staff/settings" },
  ],
  student: [
    { icon: BarChart3, label: "Overview", href: "/dashboard/student" },
    { icon: BookOpen, label: "Grades", href: "/dashboard/student/grades" },
    { icon: UserCheck, label: "Attendance", href: "/dashboard/student/attendance" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/student/schedule" },
    { icon: Settings, label: "Settings", href: "/dashboard/student/settings" },
  ],
}

export function Sidebar({ userRole, currentPath }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await AuthService.logout()
    router.push("/login")
  }

  const items = navigationItems[userRole] || []

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">College Management</h2>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                  isCollapsed && "px-2",
                )}
                onClick={() => router.push(item.href)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Separator className="mb-3" />
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent", isCollapsed && "px-2")}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

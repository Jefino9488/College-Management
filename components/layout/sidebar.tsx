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
import { ThemeToggle } from "@/components/theme/theme-toggle"

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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await AuthService.logout()
    router.push("/login")
  }

  const items = navigationItems[userRole] || []

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm focus-ring shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileOpen}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <nav
        id="mobile-navigation"
        className={cn(
          "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 animate-slide-up",
          "fixed lg:relative z-50 lg:z-auto",
          isCollapsed ? "w-16" : "w-64",
          // Mobile responsive classes
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={!isMobileOpen && "true"}
      >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-sidebar-foreground truncate">
            College Management
          </h2>
        )}
        <div className="flex items-center gap-2">
          {/* Close mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
          {/* Collapse/expand button for desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hidden lg:flex"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2" role="menu" aria-label={`${userRole} navigation menu`}>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group focus-ring",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm",
                  isCollapsed && "px-2",
                  !isActive && "hover:translate-x-1 hover:shadow-sm",
                )}
                onClick={() => {
                  router.push(item.href)
                  setIsMobileOpen(false) // Close mobile menu on navigation
                }}
                role="menuitem"
                aria-current={isActive ? "page" : undefined}
                aria-label={`Navigate to ${item.label}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <Separator className="mb-3" />
        <div className="space-y-2">
          {/* Theme Toggle */}
          <div className={cn("flex", isCollapsed ? "justify-center" : "justify-between items-center")}>
            {!isCollapsed && <span className="text-sm font-medium text-sidebar-foreground">Theme</span>}
            <ThemeToggle />
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group",
              isCollapsed && "px-2"
            )}
            onClick={handleLogout}
            aria-label="Sign out of your account"
          >
            <LogOut className={cn("h-4 w-4 transition-transform group-hover:scale-110", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </Button>
        </div>
      </div>
    </nav>
    </>
  )
}

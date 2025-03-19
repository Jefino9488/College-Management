"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Calendar, ChevronDown, ClipboardList, Home, LogOut, Menu, User, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navigation() {
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (!user) return null

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <Home className="h-5 w-5" />,
            roles: ["PRINCIPAL", "HOD", "STAFF", "STUDENT"],
        },
        {
            name: "Profile",
            href: "/profile",
            icon: <User className="h-5 w-5" />,
            roles: ["PRINCIPAL", "HOD", "STAFF", "STUDENT"],
        },
        {
            name: "Departments",
            href: "/departments",
            icon: <BookOpen className="h-5 w-5" />,
            roles: ["PRINCIPAL"],
        },
        {
            name: "Staff",
            href: "/staff",
            icon: <ClipboardList className="h-5 w-5" />,
            roles: ["PRINCIPAL", "HOD"],
        },
        {
            name: "Attendance",
            href: "/attendance",
            icon: <Calendar className="h-5 w-5" />,
            roles: ["STAFF", "STUDENT"],
        },
    ]

    const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden border-b bg-background md:block">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/dashboard" className="text-xl font-bold">
                            College Management
                        </Link>
                        <nav className="flex items-center gap-4">
                            {filteredNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                                        pathname === item.href ? "text-primary" : "text-muted-foreground",
                                    )}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="border-b bg-background md:hidden">
                <div className="flex h-14 items-center justify-between px-4">
                    <Link href="/dashboard/dashboard" className="text-lg font-bold">
                        College Management
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
                {mobileMenuOpen && (
                    <div className="border-t px-4 py-2">
                        <nav className="flex flex-col gap-2">
                            {filteredNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                            <Button variant="ghost" className="flex w-full items-center justify-start gap-2 px-3" onClick={logout}>
                                <LogOut className="h-5 w-5" />
                                Log out
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </>
    )
}


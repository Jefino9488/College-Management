import { useNavigate } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthenticationResponseDTO } from "@/lib/api";

interface NavbarProps {
    user: AuthenticationResponseDTO | null;
}

export default function Navbar({ user }: NavbarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authResponse");
        navigate("/login");
    };

    // Role-based navigation items
    const getNavItems = () => {
        if (!user) return [];
        switch (user.role) {
            case "STUDENT":
                return [
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Grades", path: "/grades" },
                    { label: "Attendance", path: "/attendance" },
                    { label: "Certificates", path: "/certificates" },
                    { label: "Fees", path: "/fees" },
                    { label: "Profile", path: "/profile" },
                ];
            case "STAFF":
                return [
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Students", path: "/staff/students" },
                    { label: "Grades", path: "/staff/grades" },
                    { label: "Attendance", path: "/attendance" },
                    { label: "Schedule", path: "/schedule" },
                    { label: "Profile", path: "/profile" },
                ];
            case "HOD":
                return [
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Students", path: "/staff/students" },
                    { label: "Teachers", path: "/hod/teachers" },
                    { label: "Subjects", path: "/hod/subjects" },
                    { label: "Attendance", path: "/attendance" },
                    { label: "Schedule", path: "/schedule" },
                    { label: "Profile", path: "/profile" },
                ];
            case "PRINCIPAL":
                return [
                    { label: "Dashboard", path: "/dashboard" },
                    { label: "Departments", path: "/departments" },
                    { label: "College Management", path: "/college-management" },
                    { label: "Staff", path: "/staff" },
                    { label: "Students", path: "/students" },
                    { label: "Reports", path: "/reports" },
                    { label: "Home", path: "/home" },
                    { label: "Profile", path: "/profile" },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <nav className="bg-[--color-sidebar] text-[--color-sidebar-foreground] border-b border-[--color-sidebar-border] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-lg font-bold">
                    College Manager {user?.collegeName ? ` - ${user.collegeName}` : ""}
                </span>
                {user && (
                    <NavigationMenu>
                        <NavigationMenuList>
                            {navItems.map((item) => (
                                <NavigationMenuItem key={item.path}>
                                    <NavigationMenuLink
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-[--color-sidebar] text-[--color-sidebar-foreground] hover:bg-[--color-sidebar-accent] hover:text-[--color-sidebar-accent-foreground]"
                                        )}
                                        onClick={() => navigate(item.path)}
                                    >
                                        {item.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                )}
            </div>
            <div>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                    <AvatarFallback>
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56 bg-[--color-card] text-[--color-card-foreground] border-[--color-border]"
                            align="end"
                        >
                            <DropdownMenuLabel>
                                {user.firstName} {user.lastName}
                                <p className="text-sm text-[--color-muted-foreground]">{user.role}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="hover:bg-[--color-accent] hover:text-[--color-accent-foreground]"
                                onClick={() => navigate("/profile")}
                            >
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="hover:bg-[--color-accent] hover:text-[--color-accent-foreground]"
                                onClick={handleLogout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="outline" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}
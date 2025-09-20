"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Laptop } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Ensure mounted before accessing systemTheme
    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return null
    }

    // Determine current effective theme
    const currentTheme = theme === "system" ? systemTheme : theme

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Use light theme"
                onClick={() => setTheme("light")}
                className={currentTheme === "light" ? "bg-accent" : ""}
            >
                <Sun className="h-5 w-5" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                aria-label="Use dark theme"
                onClick={() => setTheme("dark")}
                className={currentTheme === "dark" ? "bg-accent" : ""}
            >
                <Moon className="h-5 w-5" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                aria-label="Use system theme"
                onClick={() => setTheme("system")}
                className={theme === "system" ? "bg-accent" : ""}
            >
                <Laptop className="h-5 w-5" />
            </Button>
        </div>
    )
}

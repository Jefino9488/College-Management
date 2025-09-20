import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-3"
}

const variantClasses = {
  default: "border-muted-foreground/30 border-t-muted-foreground",
  primary: "border-primary/30 border-t-primary",
  secondary: "border-secondary/30 border-t-secondary"
}

export function LoadingSpinner({
  className,
  size = "md",
  variant = "default",
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingOverlay({
  children,
  isLoading,
  className,
  ...props
}: {
  children: React.ReactNode
  isLoading: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <LoadingSpinner size="lg" variant="primary" />
        </div>
      )}
    </div>
  )
}
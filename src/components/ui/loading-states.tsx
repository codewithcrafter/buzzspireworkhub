"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "neutral"
}

function Spinner({ className, size = "md", variant = "primary", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
  }

  const variantColors = {
    primary: "text-primary",
    secondary: "text-secondary",
    neutral: "text-muted-foreground",
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn("animate-spin shrink-0", sizeClasses[size], variantColors[variant])} />
    </div>
  )
}

interface TopBarLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  duration?: number
}

function TopBarLoader({ className, duration = 3, ...props }: TopBarLoaderProps) {
  return (
    <div
      className={cn("fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-primary/10", className)}
      {...props}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      />
    </div>
  )
}

interface CardSkeletonGridProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
}

function CardSkeletonGrid({ className, count = 3, ...props }: CardSkeletonGridProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-6 border border-border/60 bg-card rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
            <div className="size-8 bg-muted rounded-xl animate-pulse" />
          </div>
          <div className="h-8 w-1/2 bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export { Spinner, TopBarLoader, CardSkeletonGrid }
export type { SpinnerProps, TopBarLoaderProps, CardSkeletonGridProps }

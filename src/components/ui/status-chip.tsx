import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusChipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.75 text-xs font-medium border transition-colors select-none",
  {
    variants: {
      status: {
        active: "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        pending: "bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400",
        error: "bg-destructive/5 border-destructive/20 text-destructive",
        inactive: "bg-muted border-border text-muted-foreground",
        info: "bg-primary/5 border-primary/20 text-primary",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
)

const pulseVariants = cva(
  "size-1.5 rounded-full",
  {
    variants: {
      status: {
        active: "bg-emerald-500 animate-pulse",
        pending: "bg-amber-500 animate-pulse",
        error: "bg-destructive animate-pulse",
        inactive: "bg-muted-foreground/60",
        info: "bg-primary animate-pulse",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
)

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {
  showPulse?: boolean
}

function StatusChip({ className, status, showPulse = true, children, ...props }: StatusChipProps) {
  return (
    <span
      className={cn(statusChipVariants({ status }), className)}
      {...props}
    >
      {showPulse && <span className={pulseVariants({ status })} />}
      <span>{children}</span>
    </span>
  )
}

export { StatusChip, statusChipVariants }

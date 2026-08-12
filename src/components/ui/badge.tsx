import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight transition-all duration-300 select-none border",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
        secondary:
          "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15",
        success:
          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15",
        warning:
          "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 dark:text-amber-500",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15",
        neutral:
          "bg-muted text-muted-foreground border-border hover:bg-muted/80",
        outline:
          "bg-transparent text-foreground border-border hover:bg-muted/50",
        glow:
          "bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(37,99,235,0.15)] animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

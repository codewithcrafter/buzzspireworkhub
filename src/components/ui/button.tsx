"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow hover:-translate-y-0.5",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/95 shadow-sm hover:-translate-y-0.5 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:-translate-y-0.5 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white border-transparent shadow-md hover:shadow-lg hover:brightness-105 hover:-translate-y-0.5 transition-all duration-200",
        glass: "bg-white/70 backdrop-blur-md text-foreground border border-slate-200/80 hover:bg-white/90 hover:-translate-y-0.5 shadow-sm",
      },
      size: {
        default: "h-9 gap-2 px-4",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-base rounded-xl [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9 rounded-lg",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: "start" | "end"
}

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, loadingText, icon, iconPosition = "start", children, disabled, ...props }, ref) => {
    return (
      <ButtonPrimitive
        data-slot="button"
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin size-4 shrink-0" />
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === "start" && <span className="inline-flex shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === "end" && <span className="inline-flex shrink-0">{icon}</span>}
          </>
        )}
      </ButtonPrimitive>
    )
  }
)
BaseButton.displayName = "Button"

export { BaseButton as Button, buttonVariants }

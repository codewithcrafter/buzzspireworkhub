"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.ComponentProps<"div"> {
  src?: string
  alt?: string
  fallback?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "away" | "busy" | null
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", status = null, children, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(!src)

    React.useEffect(() => {
      setImageError(!src)
    }, [src])

    const sizeClasses = {
      xs: "size-6 text-[10px]",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-12 text-base",
      xl: "size-16 text-lg",
    }

    const statusColors = {
      online: "bg-emerald-500 ring-2 ring-background",
      offline: "bg-muted-foreground/60 ring-2 ring-background",
      away: "bg-amber-500 ring-2 ring-background",
      busy: "bg-destructive ring-2 ring-background",
    }

    const statusSizes = {
      xs: "size-1.5 bottom-0 right-0",
      sm: "size-2 bottom-0 right-0",
      md: "size-2.5 bottom-0.5 right-0.5",
      lg: "size-3 bottom-0.5 right-0.5",
      xl: "size-4 bottom-1 right-1",
    }

    const initialFallback = fallback || alt?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?"

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 select-none ring-1 ring-slate-200 overflow-hidden",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {!imageError && src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : children ? (
          children
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-white uppercase tracking-wider font-heading text-xs font-bold">
            {initialFallback}
          </span>
        )}
        {status && (
          <span
            className={cn(
              "absolute rounded-full",
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-white uppercase tracking-wider font-heading text-xs font-bold", className)}>
      {children}
    </span>
  )
}

export function AvatarImage({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || "Avatar"} className={cn("aspect-square h-full w-full object-cover", className)} />
  )
}

interface AvatarGroupProps extends React.ComponentProps<"div"> {
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

function AvatarGroup({ className, children, max = 4, size = "sm", ...props }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children)
  const displayedChildren = childrenArray.slice(0, max)
  const remainingCount = childrenArray.length - max

  const spacingClasses = {
    xs: "-space-x-1.5",
    sm: "-space-x-2",
    md: "-space-x-2.5",
    lg: "-space-x-3",
    xl: "-space-x-4",
  }

  const offsetRing = "ring-2 ring-white hover:z-10 transition-all hover:scale-105"

  return (
    <div
      className={cn("flex items-center justify-center", spacingClasses[size], className)}
      {...props}
    >
      {displayedChildren.map((child, index) => {
        if (React.isValidElement<AvatarProps>(child)) {
          return React.cloneElement(child, {
            size,
            className: cn(offsetRing, child.props.className),
            key: index,
          })
        }
        return child
      })}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-slate-200 border border-slate-300 font-medium text-slate-700 select-none ring-2 ring-white hover:z-10 transition-all hover:scale-105",
            size === "xs" && "size-6 text-[10px]",
            size === "sm" && "size-8 text-xs",
            size === "md" && "size-10 text-sm",
            size === "lg" && "size-12 text-base",
            size === "xl" && "size-16 text-lg"
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
export type { AvatarProps, AvatarGroupProps }

import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

function SectionHeader({
  className,
  title,
  description,
  actions,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between py-4 border-b border-border/40 mb-4",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight font-heading text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export { SectionHeader }
export type { SectionHeaderProps }

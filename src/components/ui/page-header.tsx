import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: React.ReactNode
}

function PageHeader({
  className,
  title,
  description,
  actions,
  breadcrumbs,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-border/60 mb-6",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        {breadcrumbs && (
          <div className="flex items-center text-xs text-muted-foreground pb-1">
            {breadcrumbs}
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight font-heading text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  )
}

export { PageHeader }
export type { PageHeaderProps }

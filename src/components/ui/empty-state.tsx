import * as React from "react"
import { HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onActionClick?: () => void
}

function EmptyState({
  className,
  title,
  description,
  icon = <HelpCircle className="size-8 text-muted-foreground" />,
  actionLabel,
  onActionClick,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/85 rounded-2xl bg-card/40 select-none py-12",
        className
      )}
      {...props}
    >
      {/* Icon Area */}
      <div className="size-14 rounded-2xl bg-muted border border-border/40 flex items-center justify-center mb-4 text-muted-foreground shadow-sm">
        {icon}
      </div>

      {/* Text Area */}
      <div className="max-w-xs space-y-1.5 mb-5">
        <h4 className="text-base font-bold font-heading text-foreground">{title}</h4>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Primary Action Button */}
      {actionLabel && onActionClick && (
        <Button
          onClick={onActionClick}
          variant="outline"
          size="sm"
          className="cursor-pointer font-medium hover:bg-muted"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }

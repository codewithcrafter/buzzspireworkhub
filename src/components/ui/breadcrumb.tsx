import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

function Breadcrumb({ className, items, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1.5 text-xs text-muted-foreground", className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="size-3.5 text-muted-foreground/50 shrink-0" />}
            {isLast ? (
              <span className="font-medium text-foreground select-none">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbProps, BreadcrumbItem }

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  const fetchPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, "dots", totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, "dots", ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [1, "dots", ...middleRange, "dots", totalPages]
    }

    return range(1, totalPages)
  }

  const pageNumbers = fetchPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-between items-center select-none pt-4 border-t border-border/40", className)}
      {...props}
    >
      <div className="text-xs text-muted-foreground font-medium hidden sm:block">
        Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* Previous page trigger */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* Page List */}
        {pageNumbers.map((num, idx) => {
          if (num === "dots") {
            return (
              <span key={`dots-${idx}`} className="flex size-8 items-center justify-center text-muted-foreground">
                <MoreHorizontal className="size-4" />
              </span>
            )
          }

          const pageNum = num as number
          const isCurrent = pageNum === currentPage

          return (
            <Button
              key={pageNum}
              variant={isCurrent ? "default" : "outline"}
              size="icon-sm"
              onClick={() => onPageChange(pageNum)}
              className={cn("cursor-pointer font-medium text-xs", isCurrent && "shadow-sm")}
            >
              {pageNum}
            </Button>
          )
        })}

        {/* Next page trigger */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  )
}

export { Pagination }
export type { PaginationProps }

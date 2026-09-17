"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = React.createContext<DropdownContextType | undefined>(undefined)

export function Dropdown({
  children,
  onOpenChange,
}: {
  children: React.ReactNode
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleSetOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      setOpen((prev) => {
        const next = typeof value === "function" ? value(prev) : value
        if (next !== prev) onOpenChange?.(next)
        return next
      })
    },
    [onOpenChange]
  )

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleSetOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, handleSetOpen])

  return (
    <DropdownContext.Provider value={{ open, setOpen: handleSetOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

export function DropdownTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownTrigger must be used within Dropdown")

  return (
    <div
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn("cursor-pointer inline-flex items-center", className)}
      role="button"
      tabIndex={0}
      aria-expanded={context.open}
    >
      {children}
    </div>
  )
}

export function DropdownContent({
  children,
  align = "right",
  className,
}: {
  children: React.ReactNode
  align?: "left" | "right" | "center"
  className?: string
}) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownContent must be used within Dropdown")

  if (!context.open) return null

  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all animate-in fade-in-0 zoom-in-95",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  className,
  destructive = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  destructive?: boolean
}) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error("DropdownItem must be used within Dropdown")

  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) onClick()
        context.setOpen(false)
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors text-left",
        destructive && "text-red-600 hover:bg-red-50 hover:text-red-700",
        className
      )}
    >
      {children}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-slate-100" />
}

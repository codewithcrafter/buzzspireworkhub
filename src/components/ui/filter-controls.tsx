"use client"

import * as React from "react"
import { Filter, ChevronDown, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
}

function FilterControls({
  className,
  label,
  options,
  selectedValues,
  onChange,
  ...props
}: FilterControlsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value)
    let newSelected: string[]
    if (isSelected) {
      newSelected = selectedValues.filter((v) => v !== value)
    } else {
      newSelected = [...selectedValues, value]
    }
    onChange(newSelected)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
  }

  return (
    <div className={cn("relative inline-block text-left select-none", className)} ref={containerRef} {...props}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 cursor-pointer font-medium"
      >
        <Filter className="size-3.5 text-muted-foreground" />
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="flex items-center gap-1 pl-1 ml-1 border-l border-border/80 text-xs font-semibold text-primary">
            {selectedValues.length}
            <button
              onClick={handleClear}
              className="hover:bg-primary/10 rounded p-0.5"
            >
              <X className="size-2.5 text-primary" />
            </button>
          </span>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-48 z-40 bg-card border border-border/80 rounded-xl shadow-lg p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] uppercase font-bold text-muted-foreground/80 px-2 py-1 select-none tracking-wider">
            Filter by
          </div>
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isChecked = selectedValues.includes(opt.value)

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex items-center justify-between w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-muted font-medium transition-colors cursor-pointer",
                    isChecked ? "text-primary" : "text-foreground/80"
                  )}
                >
                  <span>{opt.label}</span>
                  {isChecked && <Check className="size-3.5 text-primary" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { FilterControls }
export type { FilterControlsProps, FilterOption }

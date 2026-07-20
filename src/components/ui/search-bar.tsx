"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  showCommandShortcut?: boolean
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, showCommandShortcut = true, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = ""
        const event = {
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as React.ChangeEvent<HTMLInputElement>
        onChange?.(event)
      }
      onClear?.()
    }

    return (
      <div className={cn("relative w-full max-w-md group/search", className)}>
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within/search:text-primary transition-colors">
          <Search className="size-4" />
        </div>

        {/* Search input field */}
        <input
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) ref.current = node
          }}
          type="text"
          value={value}
          onChange={onChange}
          className="block w-full pl-9 pr-12 py-1.5 text-sm bg-muted/40 hover:bg-muted/70 focus:bg-background border border-border/60 focus:border-primary/50 rounded-lg outline-none transition-all focus:ring-2 focus:ring-primary/10 text-foreground placeholder:text-muted-foreground"
          {...props}
        />

        {/* Icons inside the search input */}
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          {value && (
            <button
              onClick={handleClear}
              type="button"
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-0.5 hover:bg-muted transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
          
          {showCommandShortcut && !value && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[9px] font-medium text-muted-foreground/60 transition-opacity">
              <span>⌘</span>K
            </kbd>
          )}
        </div>
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar }
export type { SearchBarProps }

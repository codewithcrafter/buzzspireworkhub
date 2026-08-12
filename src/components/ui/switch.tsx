"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({ className, checked, defaultChecked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-input bg-muted transition-colors",
        className
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        {...props}
      />
      <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-background shadow transition-transform duration-200 peer-checked:translate-x-5" />
      <span className="block h-full w-full rounded-full bg-slate-200/80 transition-colors duration-200 peer-checked:bg-primary/20" />
    </label>
  )
}

export { Switch }
export type { SwitchProps }

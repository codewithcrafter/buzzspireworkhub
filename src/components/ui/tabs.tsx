"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: "underline" | "capsule"
}

function Tabs({
  className,
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  ...props
}: TabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 overflow-x-auto pb-px border-b border-border/40 select-none",
        variant === "capsule" && "bg-muted/60 p-1 rounded-xl border-none inline-flex w-auto pb-1",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors outline-none cursor-pointer",
              variant === "underline" && "pb-3.5 hover:text-foreground text-muted-foreground",
              variant === "underline" && isActive && "text-primary font-semibold",
              variant === "capsule" && "rounded-lg py-1.5 hover:text-foreground text-muted-foreground",
              variant === "capsule" && isActive && "text-foreground font-semibold"
            )}
          >
            {/* Active sliding indicator */}
            {isActive && (
              <motion.div
                layoutId={`active-tab-${props.id || "default"}`}
                className={cn(
                  "absolute",
                  variant === "underline" && "bottom-0 left-0 right-0 h-0.5 bg-primary",
                  variant === "capsule" && "inset-0 bg-background shadow-sm rounded-lg -z-10 border border-border/20"
                )}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export { Tabs }
export type { TabsProps, TabItem }

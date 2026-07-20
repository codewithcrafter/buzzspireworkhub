"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface ChartPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "area" | "bar" | "donut"
  height?: number
}

function ChartsPlaceholder({
  className,
  type = "area",
  height = 240,
  ...props
}: ChartPlaceholderProps) {
  
  if (type === "bar") {
    const barData = [65, 45, 80, 55, 95, 70, 85, 40, 75, 90, 60, 100]
    
    return (
      <div
        className={cn(
          "flex flex-col justify-between w-full p-6 border border-border/60 bg-card rounded-2xl shadow-sm",
          className
        )}
        style={{ height }}
        {...props}
      >
        <div className="flex-1 flex items-end justify-between gap-2.5 md:gap-4 select-none">
          {barData.map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar cursor-pointer">
              {/* Tooltip on hover */}
              <div className="absolute -translate-y-12 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none select-none">
                {val}%
              </div>
              <div className="w-full bg-muted rounded-md h-full relative overflow-hidden flex items-end min-h-[120px]">
                <motion.div
                  className="w-full bg-gradient-to-t from-primary to-secondary rounded-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.05 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold">M{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "donut") {
    const segments = [
      { percentage: 40, color: "text-primary", label: "Direct", value: "40%" },
      { percentage: 30, color: "text-secondary", label: "Referral", value: "30%" },
      { percentage: 20, color: "text-accent", label: "Social", value: "20%" },
      { percentage: 10, color: "text-muted-foreground", label: "Email", value: "10%" },
    ]

    // Calculate stroke dashes
    let accumulatedPercent = 0

    return (
      <div
        className={cn(
          "flex flex-col md:flex-row items-center justify-around w-full p-6 border border-border/60 bg-card rounded-2xl shadow-sm gap-6",
          className
        )}
        style={{ height }}
        {...props}
      >
        <div className="relative size-36 shrink-0 flex items-center justify-center select-none">
          <svg className="size-full rotate-[-90deg]" viewBox="0 0 100 100">
            {segments.map((seg, idx) => {
              const dashArray = `${seg.percentage} ${100 - seg.percentage}`
              const dashOffset = 100 - accumulatedPercent
              accumulatedPercent += seg.percentage

              return (
                <motion.circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="38"
                  className={cn("fill-none stroke-[10]", seg.color)}
                  strokeDasharray={dashArray}
                  strokeDashoffset={100}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: idx * 0.1 }}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-heading">10.4k</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Visits</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {segments.map((seg, idx) => (
            <div key={idx} className="flex items-center gap-8 justify-between text-sm select-none border-b border-border/20 pb-1 w-44">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full shrink-0", seg.color.replace("text-", "bg-"))} />
                <span className="text-muted-foreground font-medium">{seg.label}</span>
              </div>
              <span className="font-bold text-foreground">{seg.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default: Area Chart
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between w-full p-6 border border-border/60 bg-card rounded-2xl shadow-sm overflow-hidden",
        className
      )}
      style={{ height }}
      {...props}
    >
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      
      <div className="relative z-10 flex-1 w-full h-full flex items-end">
        <svg className="w-full h-5/6 overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill 2 */}
          <motion.path
            d="M 0,150 Q 100,60 200,90 T 400,30 T 500,10 L 500,150 Z"
            fill="url(#areaGradient2)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />

          {/* Stroke Path 2 */}
          <motion.path
            d="M 0,150 Q 100,60 200,90 T 400,30 T 500,10"
            fill="none"
            className="text-secondary"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          {/* Area Fill 1 */}
          <motion.path
            d="M 0,150 Q 80,110 160,80 T 320,120 T 500,50 L 500,150 Z"
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />

          {/* Stroke Path 1 */}
          <motion.path
            d="M 0,150 Q 80,110 160,80 T 320,120 T 500,50"
            fill="none"
            className="text-primary"
            stroke="currentColor"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="relative z-10 flex justify-between text-[10px] text-muted-foreground font-semibold mt-3 pt-3 border-t border-border/40 select-none">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
      </div>
    </div>
  )
}

export { ChartsPlaceholder }
export type { ChartPlaceholderProps }

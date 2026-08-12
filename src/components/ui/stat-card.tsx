"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps extends React.ComponentProps<typeof Card> {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label?: string
    direction: "up" | "down" | "neutral"
  }
  sparklineData?: number[]
  icon?: React.ReactNode
}

function StatCard({
  className,
  title,
  value,
  description,
  trend,
  sparklineData = [30, 45, 35, 60, 49, 70, 65, 80],
  icon,
  ...props
}: StatCardProps) {
  // SVG sparkline path generator
  const getSparklinePath = (data: number[]) => {
    if (data.length === 0) return ""
    const width = 100
    const height = 30
    const padding = 2
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - padding * 2) + padding
      const y = height - ((val - min) / range) * (height - padding * 2) - padding
      return `${x},${y}`
    })

    return `M ${points.join(" L ")}`
  }

  const pathString = getSparklinePath(sparklineData)

  const trendConfig = {
    up: {
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      icon: <ArrowUpRight className="size-3" />,
    },
    down: {
      color: "text-destructive bg-destructive/10 border-destructive/20",
      icon: <ArrowDownRight className="size-3" />,
    },
    neutral: {
      color: "text-muted-foreground bg-muted border-border",
      icon: <Minus className="size-3" />,
    },
  }

  return (
    <Card className={cn("overflow-hidden group/stat", className)} {...props}>
      <CardContent className="pt-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
            <h3 className="text-2xl font-bold font-heading tracking-tight text-foreground group-hover/stat:text-primary transition-colors duration-300">
              {value}
            </h3>
          </div>
          {icon && (
            <div className="size-9 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-muted-foreground group-hover/stat:bg-primary/10 group-hover/stat:text-primary group-hover/stat:border-primary/20 transition-all duration-300">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="space-y-1.5">
            {trend && (
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border select-none",
                  trendConfig[trend.direction].color
                )}>
                  {trendConfig[trend.direction].icon}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-[10px] text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            )}
          </div>

          {/* Animated Mini Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="w-24 h-8 select-none pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 30" className="overflow-visible">
                <motion.path
                  d={pathString}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    trend?.direction === "down" ? "text-destructive" : "text-primary"
                  )}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { StatCard }
export type { StatCardProps }

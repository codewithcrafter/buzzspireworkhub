"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  size?: "default" | "sm"
  variant?: "default" | "glass" | "glow"
  glowColor?: string
}

function Card({
  className,
  size = "default",
  variant = "default",
  glowColor = "rgba(37, 99, 235, 0.15)",
  ...props
}: CardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const baseStyles = "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-2xl bg-card py-(--card-spacing) text-sm text-card-foreground border border-border/60 transition-all duration-300 [--card-spacing:--spacing(5)] data-[size=sm]:[--card-spacing:--spacing(3.5)] shadow-sm hover:shadow-md"
  
  const variantStyles = {
    default: "",
    glass: "bg-white/10 dark:bg-black/10 backdrop-blur-md border-white/20 dark:border-white/10",
    glow: "relative border-border/50",
  }

  if (variant === "glow") {
    return (
      <div
        data-slot="card"
        data-size={size}
        onMouseMove={handleMouseMove}
        className={cn(baseStyles, variantStyles.glow, "group/glow-card", className)}
        {...props}
      >
        {/* Glow effect mask */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover/glow-card:opacity-100 transition-opacity duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                350px circle at ${mouseX}px ${mouseY}px,
                ${glowColor},
                transparent 80%
              )
            `,
          }}
        />
        {/* Border Glow */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover/glow-card:opacity-100 transition-opacity duration-300 border-2 border-primary/30"
          style={{
            maskImage: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent
              )
            `,
            WebkitMaskImage: useMotionTemplate`
              radial-gradient(
                200px circle at ${mouseX}px ${mouseY}px,
                white,
                transparent
              )
            `,
          }}
        />
        <div className="relative z-10 flex flex-col h-full justify-between">
          {props.children}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg font-bold leading-snug tracking-tight text-foreground group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing) flex-1", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-2xl border-t border-border/40 bg-muted/30 p-(--card-spacing) mt-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
export type { CardProps }

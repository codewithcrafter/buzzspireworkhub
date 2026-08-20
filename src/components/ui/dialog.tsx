"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: DialogProps) {
  // Keypress listener for Escape key to close dialog
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.45 }}
            className={cn(
              "relative w-full overflow-hidden rounded-2xl bg-card border border-border/80 shadow-2xl z-10 flex flex-col max-h-[calc(100vh-2rem)]",
              sizeClasses[size]
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4 shrink-0">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading tracking-tight text-foreground">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                className="rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Content Body */}
            <div data-lenis-prevent="true" className="px-6 py-4 flex-1 min-h-0 overflow-y-auto text-sm text-foreground/80 leading-relaxed">
              {children}
            </div>

            {/* Footer Actions */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 p-6 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { Dialog }
export type { DialogProps }

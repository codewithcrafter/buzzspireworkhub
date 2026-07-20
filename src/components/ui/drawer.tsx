"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  position?: "right" | "left" | "bottom"
}

function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
}: DrawerProps) {
  // Keypress listener for Escape key to close drawer
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

  const slideVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      className: "fixed top-0 right-0 h-full w-full max-w-md border-l border-border/80 shadow-2xl",
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      className: "fixed top-0 left-0 h-full w-full max-w-md border-r border-border/80 shadow-2xl",
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
      className: "fixed bottom-0 left-0 right-0 h-auto w-full max-h-[90vh] border-t border-border/80 rounded-t-2xl shadow-2xl",
    },
  }

  const selectedVariant = slideVariants[position]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            exit={selectedVariant.exit}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className={cn(
              "z-10 bg-card flex flex-col focus:outline-none",
              selectedVariant.className
            )}
          >
            {/* Header section */}
            <div className="flex items-start justify-between p-6 border-b border-border/40">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-heading tracking-tight text-foreground">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
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

            {/* Scrollable Content Workspace */}
            <div className="flex-1 p-6 overflow-y-auto text-sm text-foreground/80 leading-relaxed">
              {children}
            </div>

            {/* Footer buttons layout */}
            {footer && (
              <div className="p-6 border-t border-border/40 bg-muted/20 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export { Drawer }
export type { DrawerProps }

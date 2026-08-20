"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "warning" | "error" | "info"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

function safeNormalize(val: any): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (val instanceof Error) return val.message;
  if (typeof val === "object") {
    if (typeof val.message === "string") return val.message;
    if (val.error && typeof val.error.message === "string") return val.error.message;
    if (val.error && typeof val.error === "string") return val.error;
    if (val.code && typeof val.code === "string") return `Error: ${val.code}`;
    return "An unknown error occurred";
  }
  return String(val);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    // Safely normalize title and description
    const safeTitle = item.title ? safeNormalize(item.title) : "";
    let safeDescription = item.description ? safeNormalize(item.description) : undefined;
    
    // If normalization resulted in empty string but it wasn't empty originally, fallback
    if (!safeTitle && item.title) {
       safeDescription = "An unknown error occurred";
    }

    const newToast: ToastItem = { 
      ...item, 
      id,
      title: safeTitle || "Notification",
      description: safeDescription
    }
    
    setToasts((prev) => [...prev, newToast])

    const duration = item.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }
  }, [dismiss])

  const iconMap = {
    success: <CheckCircle className="size-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="size-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="size-5 text-destructive shrink-0" />,
    info: <Info className="size-5 text-primary shrink-0" />,
  }

  const toastBorder = {
    success: "border-emerald-500/20",
    warning: "border-amber-500/20",
    error: "border-destructive/20",
    info: "border-primary/20",
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                "flex items-start gap-3 p-4 bg-card border rounded-xl shadow-xl pointer-events-auto",
                toastBorder[t.type || "info"]
              )}
            >
              {iconMap[t.type || "info"]}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h4 className="text-sm font-bold font-heading text-foreground">{t.title}</h4>
                {t.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full shrink-0"
              >
                <X className="size-3.5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

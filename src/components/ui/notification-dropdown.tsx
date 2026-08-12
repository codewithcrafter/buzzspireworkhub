"use client"

import * as React from "react"
import { Check, Mail, MessageSquare, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  type?: "message" | "task" | "payment" | "alert"
}

interface NotificationDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItem[]
  onMarkAllRead?: () => void
  onItemClick?: (id: string) => void
}

function NotificationDropdown({
  className,
  notifications: initialNotifications,
  onMarkAllRead,
  onItemClick,
  ...props
}: NotificationDropdownProps) {
  const defaultNotifications: NotificationItem[] = [
    {
      id: "notif-1",
      title: "New lead captured",
      description: "Acme Corp signed up as a new premium business lead.",
      time: "2 mins ago",
      unread: true,
      type: "task",
    },
    {
      id: "notif-2",
      title: "Payment processed",
      description: "Invoice #BS-4019 for ₹48,000 has been paid successfully.",
      time: "1 hour ago",
      unread: true,
      type: "payment",
    },
    {
      id: "notif-3",
      title: "New comment on project",
      description: "Aria Mercer commented on BuzzSpire Rebranding project boards.",
      time: "4 hours ago",
      unread: false,
      type: "message",
    },
  ]

  const notifications = initialNotifications || defaultNotifications

  const iconMap = {
    message: <MessageSquare className="size-3.5 text-primary" />,
    task: <Plus className="size-3.5 text-emerald-500" />,
    payment: <ShoppingBag className="size-3.5 text-amber-500" />,
    alert: <Mail className="size-3.5 text-destructive" />,
  }

  return (
    <div
      className={cn(
        "w-80 bg-card border border-border/80 rounded-2xl shadow-xl p-1.5 flex flex-col z-50 select-none",
        className
      )}
      {...props}
    >
      {/* Header controls layout */}
      <div className="flex items-center justify-between px-2.5 py-2 border-b border-border/40 mb-1">
        <span className="text-xs font-bold text-foreground font-heading">Notifications</span>
        <button
          onClick={onMarkAllRead}
          className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="size-3" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* List items scroll feed */}
      <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            All caught up! No notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => onItemClick?.(notif.id)}
              className={cn(
                "flex items-start gap-2.5 w-full text-left p-2.5 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer relative",
                notif.unread && "bg-primary/5 hover:bg-primary/10"
              )}
            >
              {/* Unread indicator dot */}
              {notif.unread && (
                <span className="absolute top-3 left-1.5 size-1.5 bg-primary rounded-full" />
              )}
              
              <div className="size-7 rounded-lg bg-muted border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                {iconMap[notif.type || "message"]}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5 pl-0.5">
                <p className="text-xs font-semibold text-foreground truncate">{notif.title}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                  {notif.description}
                </p>
                <p className="text-[9px] text-muted-foreground/60 font-semibold">{notif.time}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export { NotificationDropdown }
export type { NotificationDropdownProps, NotificationItem }

"use client"

import * as React from "react"
import { Check, Mail, MessageSquare, Plus, ShoppingBag, BellRing } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  type?: "message" | "task" | "payment" | "alert" | string
}

export interface NotificationDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications?: NotificationItem[]
  onMarkAllRead?: () => void
  onItemClick?: (id: string) => void
  loading?: boolean
}

function NotificationDropdown({
  className,
  notifications: propsNotifications,
  onMarkAllRead,
  onItemClick,
  loading = false,
  ...props
}: NotificationDropdownProps) {
  const [items, setItems] = React.useState<NotificationItem[]>([])
  const [isFetching, setIsFetching] = React.useState(false)

  const fetchRealNotifications = React.useCallback(async () => {
    try {
      setIsFetching(true)
      const res = await fetch("/api/notifications?limit=15")
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data?.rows) {
          const formatted: NotificationItem[] = json.data.rows.map((n: any) => ({
            id: n.id,
            title: n.title,
            description: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: !n.readAt,
            type: n.type || "alert",
          }))
          setItems(formatted)
        }
      }
    } catch {
      // Graceful error fallback - show empty or prop items
    } finally {
      setIsFetching(false)
    }
  }, [])

  React.useEffect(() => {
    if (propsNotifications) {
      setItems(propsNotifications)
    } else {
      fetchRealNotifications()
    }
  }, [propsNotifications, fetchRealNotifications])

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" })
      setItems((prev) => prev.map((item) => ({ ...item, unread: false })))
      onMarkAllRead?.()
    } catch (err) {
      console.error("Failed to mark all notifications read:", err)
    }
  }

  const handleItemClick = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" })
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
      )
      onItemClick?.(id)
    } catch (err) {
      console.error("Failed to mark notification read:", err)
    }
  }

  const iconMap: Record<string, React.ReactNode> = {
    message: <MessageSquare className="size-3.5 text-primary" />,
    task: <Plus className="size-3.5 text-emerald-500" />,
    payment: <ShoppingBag className="size-3.5 text-amber-500" />,
    alert: <Mail className="size-3.5 text-destructive" />,
    LEAVE_APPROVED: <Check className="size-3.5 text-emerald-500" />,
    LEAVE_REJECTED: <Mail className="size-3.5 text-destructive" />,
  }

  return (
    <div
      className={cn(
        "w-80 bg-card border border-border/80 rounded-2xl shadow-xl p-1.5 flex flex-col z-50 select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-2.5 py-2 border-b border-border/40 mb-1">
        <span className="text-xs font-bold text-foreground font-heading">Notifications</span>
        <button
          onClick={handleMarkAllRead}
          className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="size-3" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
        {isFetching || loading ? (
          <div className="text-center py-6 text-xs text-muted-foreground animate-pulse">
            Loading notifications...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            All caught up! No notifications.
          </div>
        ) : (
          items.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleItemClick(notif.id)}
              className={cn(
                "flex items-start gap-2.5 w-full text-left p-2.5 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer relative",
                notif.unread && "bg-primary/5 hover:bg-primary/10"
              )}
            >
              {notif.unread && (
                <span className="absolute top-3 left-1.5 size-1.5 bg-primary rounded-full" />
              )}
              
              <div className="size-7 rounded-lg bg-muted border border-border/40 flex items-center justify-center shrink-0 mt-0.5">
                {iconMap[notif.type || "alert"] || <Mail className="size-3.5 text-primary" />}
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

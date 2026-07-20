"use client"

import * as React from "react"
import {
  Bell,
  Check,
  Trash2,
  Lock,
  DollarSign,
  Briefcase,
  Sliders,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Search,
  BellRing,
  Inbox,
  AlertTriangle,
} from "lucide-react"

// Import custom design system components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { PageHeader } from "@/components/ui/page-header"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { SearchBar } from "@/components/ui/search-bar"
import { FilterControls } from "@/components/ui/filter-controls"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type NotificationCategory = "security" | "billing" | "workflow" | "system"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  category: NotificationCategory
}

function NotificationsDashboard() {
  const { toast } = useToast()

  // Status Filter State: "all" | "unread" | "read"
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unread" | "read">("all")

  // Search and Category Filters State
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilters, setCategoryFilters] = React.useState<string[]>([])

  // Mock Database
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Security Lockout Warning",
      description: "Multiple failed sign-in attempts detected from IP 192.168.1.104 in Mumbai. Secondary audit logs created.",
      time: "5 mins ago",
      unread: true,
      category: "security",
    },
    {
      id: "notif-2",
      title: "Invoice Paid successfully",
      description: "Client Acme Corp paid invoice #BS-4019 for ₹48,000 for ad template designs retainer.",
      time: "1 hour ago",
      unread: true,
      category: "billing",
    },
    {
      id: "notif-3",
      title: "New lead captured in pipeline",
      description: "Cyberdyne Systems submitted an inbound leads response form online.",
      time: "4 hours ago",
      unread: true,
      category: "workflow",
    },
    {
      id: "notif-4",
      title: "System Backup Finished",
      description: "Automated nightly weekly database backup completed without syntax exceptions.",
      time: "1 day ago",
      unread: false,
      category: "system",
    },
  ])

  // Count active unread items
  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => n.unread).length
  }, [notifications])

  // Core filter logic
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilters.length === 0 || categoryFilters.includes(n.category)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unread" && n.unread) ||
        (statusFilter === "read" && !n.unread)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [notifications, searchQuery, categoryFilters, statusFilter])

  // Mark single as read
  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) => {
      if (n.id === id) {
        return { ...n, unread: !n.unread }
      }
      return n
    })
    setNotifications(updated)

    const item = notifications.find((n) => n.id === id)
    if (item) {
      toast({
        title: item.unread ? "Marked as read" : "Marked as unread",
        description: `Notification status has been updated.`,
        type: "info",
      })
    }
  }

  // Delete single card
  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    toast({
      title: "Notification Cleared",
      description: "Removed notification card from display feed.",
      type: "success",
    })
  }

  // Mark all read
  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
    toast({
      title: "Bulk Action Completed",
      description: "Marked all active notifications as read.",
      type: "success",
    })
  }

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([])
    toast({
      title: "Inbox Cleared",
      description: "Deleted all cards from notifications feed.",
      type: "info",
    })
  }

  const categoryOptions = [
    { value: "security", label: "Security Warnings" },
    { value: "billing", label: "Billing Retainers" },
    { value: "workflow", label: "Pipeline Workflows" },
    { value: "system", label: "System Maintenance" },
  ]

  const iconMap = {
    security: <Lock className="size-4.5 text-destructive" />,
    billing: <DollarSign className="size-4.5 text-amber-500" />,
    workflow: <Briefcase className="size-4.5 text-primary" />,
    system: <Sliders className="size-4.5 text-secondary" />,
  }

  const borderColors = {
    security: "border-destructive/20",
    billing: "border-amber-500/20",
    workflow: "border-primary/20",
    system: "border-secondary/20",
  }

  return (
    <div className="space-y-6 pb-16">
      <Breadcrumb
        items={[
          { label: "Admin Panel", href: "/admin" },
          { label: "Notification Logs" },
        ]}
      />

      <PageHeader
        title="Operations Notification Center"
        description="Oversee real-time security warnings, billing retrials, lead captures, and database backups."
        actions={
          <div className="flex gap-2.5 items-center select-none">
            {/* Status filters toggler */}
            <div className="bg-muted/65 p-1 rounded-xl flex items-center gap-1 border border-border/40 text-xs">
              <Button
                variant={statusFilter === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="cursor-pointer font-bold rounded-lg px-3 py-1"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "unread" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("unread")}
                className="cursor-pointer font-bold rounded-lg px-3 py-1 relative"
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="ml-1 px-1 bg-primary text-white rounded text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                variant={statusFilter === "read" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter("read")}
                className="cursor-pointer font-bold rounded-lg px-3 py-1"
              >
                Read
              </Button>
            </div>

            {notifications.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="cursor-pointer text-xs font-semibold">
                  Mark All Read
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClearAll} className="cursor-pointer text-xs text-destructive hover:bg-destructive/10 font-semibold">
                  Clear All
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/60 bg-card/60 rounded-2xl shadow-sm">
        <SearchBar
          placeholder="Search notifications by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center gap-3">
          <FilterControls
            label="Filter Categories"
            options={categoryOptions}
            selectedValues={categoryFilters}
            onChange={setCategoryFilters}
          />
          {(searchQuery || categoryFilters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setCategoryFilters([])
              }}
              className="cursor-pointer text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="space-y-4 max-w-3xl select-none">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-border/60 rounded-2xl flex flex-col items-center justify-center">
            <Inbox className="size-8 mb-2 opacity-50" />
            <p className="text-xs font-semibold">No notification items found matching criteria.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 bg-card border rounded-2xl shadow-sm transition-all duration-300 relative group/card ${
                borderColors[notif.category]
              } ${notif.unread ? "bg-primary/[0.02]" : "opacity-80"}`}
            >
              {/* Unread dot */}
              {notif.unread && (
                <span className="absolute top-4 left-3 size-1.5 bg-primary rounded-full animate-pulse" />
              )}

              {/* Icon block */}
              <div className="size-8 rounded-lg bg-muted border border-border/40 flex items-center justify-center shrink-0 mt-0.5 ml-2.5">
                {iconMap[notif.category]}
              </div>

              {/* Content text */}
              <div className="flex-1 min-w-0 space-y-0.5 pr-20 pl-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground truncate">{notif.title}</h4>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {notif.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.description}</p>
                <p className="text-[10px] text-muted-foreground/60 font-semibold flex items-center gap-1 mt-1.5">
                  <Clock className="size-3" />
                  <span>{notif.time}</span>
                </p>
              </div>

              {/* Actions controls (Hover only) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleToggleRead(notif.id)}
                  className="cursor-pointer text-muted-foreground hover:text-primary rounded-lg hover:bg-muted"
                  title={notif.unread ? "Mark as read" : "Mark as unread"}
                >
                  {notif.unread ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDelete(notif.id)}
                  className="cursor-pointer text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted"
                  title="Clear"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ToastProvider>
      <NotificationsDashboard />
    </ToastProvider>
  )
}

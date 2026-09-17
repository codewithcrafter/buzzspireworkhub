"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Shield,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Loader2,
  MailCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownDivider } from "@/components/ui/dropdown";

// ─── Notification types ────────────────────────────────────────────────────────

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

// ─── Notification Icon helper ─────────────────────────────────────────────────

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "LEAVE_APPROVED":
    case "LEAVE_REJECTED":
    case "LEAVE_CANCELLED":
      return <Calendar className="size-3.5 shrink-0 mt-0.5 text-indigo-500" />;
    case "ATTENDANCE":
    case "PUNCH_IN":
    case "PUNCH_OUT":
      return <CheckCircle2 className="size-3.5 shrink-0 mt-0.5 text-emerald-500" />;
    case "WARNING":
    case "LATE":
      return <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-orange-500" />;
    default:
      return <Clock className="size-3.5 shrink-0 mt-0.5 text-slate-400" />;
  }
}

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

// ─── Topbar Component ─────────────────────────────────────────────────────────

interface TopbarProps {
  onToggleMobileMenu: () => void;
}

export function Topbar({ onToggleMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Breadcrumb title
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle =
    segments.length > 0
      ? segments[0]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Dashboard";

  // ── Notification state ─────────────────────────────────────────────────────
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── User state ─────────────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = React.useState<{ fullName: string; role: string; email: string } | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const user = data.user || data.data?.user;
          if (data.success && user) {
            setUserProfile({
              fullName: user.fullName,
              role: user.role,
              email: user.email,
            });
          }
        }
      } catch (err) {}
    }
    fetchUser();
  }, []);

  // Fetch unread count (lightweight, runs every 60s)
  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data?.data?.unreadCount ?? 0);
      }
    } catch {
      // Silently ignore network errors — badge shows last known count
    }
  }, []);

  // Fetch notification list (only when dropdown opens)
  const fetchNotifications = React.useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=8", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data?.data?.rows ?? []);
        setUnreadCount(data?.data?.unreadCount ?? 0);
      }
    } catch {
      // ignore
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Poll unread count every 60 seconds
  React.useEffect(() => {
    fetchUnreadCount();
    pollRef.current = setInterval(fetchUnreadCount, 60_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchUnreadCount]);

  // Load notifications when dropdown opens
  React.useEffect(() => {
    if (notifOpen) {
      fetchNotifications();
    }
  }, [notifOpen, fetchNotifications]);

  // Mark all as read
  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  // Mark single notification as read
  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort: proceed with redirect even if request fails
    }
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* LEFT: Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden size-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-700 transition-colors">
              WorkHub
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-600 font-semibold">{currentTitle}</span>
          </div>
          <h1 className="font-heading text-lg font-bold text-slate-900 leading-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* RIGHT: Notifications & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* ── Live Notification Bell ─────────────────────────────────────── */}
        <Dropdown onOpenChange={setNotifOpen}>
          <DropdownTrigger>
            <button
              type="button"
              id="notification-bell"
              className="relative size-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center rounded-full bg-indigo-600 ring-2 ring-white text-[9px] font-bold text-white leading-none"
                  aria-hidden="true"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownTrigger>

          <DropdownContent align="right" className="w-80 p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
              <span className="text-xs font-bold text-slate-900">Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    title="Mark all as read"
                  >
                    <MailCheck className="size-3" />
                    All read
                  </button>
                )}
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {notifLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400">
                  <Loader2 className="size-3.5 animate-spin" />
                  Loading…
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-1.5 text-xs text-slate-400">
                  <Bell className="size-5 text-slate-200" />
                  <span>No notifications</span>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.readAt && handleMarkRead(notif.id)}
                    className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notif.readAt ? "bg-indigo-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <NotifIcon type={notif.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-semibold truncate ${!notif.readAt ? "text-slate-900" : "text-slate-700"}`}>
                            {notif.title}
                          </span>
                          {!notif.readAt && (
                            <span className="size-1.5 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          {timeAgo(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                View all notifications →
              </button>
            </div>
          </DropdownContent>
        </Dropdown>

        {/* ── User Profile Dropdown ──────────────────────────────────────── */}
        <Dropdown>
          <DropdownTrigger>
            <div className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
              <Avatar className="size-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                <AvatarFallback className="bg-indigo-600 text-white font-semibold">WH</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {userProfile?.role === "ADMIN" ? "ADMIN" : userProfile?.fullName || "User"}
                </span>
              </div>
            </div>
          </DropdownTrigger>
          <DropdownContent align="right" className="w-56 p-1.5">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <div className="text-xs font-bold text-slate-800">
                {userProfile?.role === "ADMIN" ? "ADMIN" : userProfile?.fullName || "User"}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{userProfile?.email || "user@buzzspire.com"}</div>
            </div>
            <DropdownItem onClick={() => router.push("/profile")}>
              <User className="size-3.5 text-slate-400" />
              <span>My Profile</span>
            </DropdownItem>
            <DropdownItem onClick={() => router.push("/settings")}>
              <Shield className="size-3.5 text-slate-400" />
              <span>Workplace Settings</span>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={handleLogout} destructive>
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}

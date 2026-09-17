"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  History,
  CalendarCheck2,
  Users,
  Building2,
  CalendarOff,
  Palmtree,
  BarChart3,
  ShieldCheck,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Coffee,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const navigationItems: NavItem[] = [
  { name: "Staff Dashboard", href: "/staff-dashboard", icon: LayoutDashboard },
  { name: "My Timeline", href: "/staff-dashboard/activity", icon: Activity },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My History", href: "/my-history", icon: History },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck2 },
  { name: "Break Activity", href: "/break-activity", icon: Coffee },
  { name: "Unified Timeline", href: "/activity", icon: Activity },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "My Payroll", href: "/my-payroll", icon: BarChart3 },
  { name: "Payroll", href: "/payroll", icon: BarChart3 },
  { name: "Leaves", href: "/leaves", icon: CalendarOff },
  { name: "Holidays", href: "/holidays", icon: Palmtree },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Audit", href: "/audit", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

const ADMIN_ONLY_ROUTES = ["/dashboard", "/employees", "/departments", "/reports", "/audit", "/settings", "/attendance", "/break-activity", "/activity", "/payroll"];

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const userRole = data.user?.role || data.data?.user?.role;
          if (data.success && userRole) {
            setRole(userRole);
          }
        }
      } catch (err) {}
    }
    fetchRole();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Best-effort: proceed with redirect even if request fails
    }
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none h-full",
        className
      )}
    >
      {/* WorkHub Logo & Name */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="size-9 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10 overflow-hidden bg-white shrink-0">
          <Image src="/buzzspire-logo.png" alt="BuzzSpire Logo" width={36} height={36} className="object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-bold text-sm tracking-tight text-white">
            BUZZSPIRE WORKHUB
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
            ATTENDANCE PORTAL
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navigationItems.map((item) => {
          // Conditional rendering logic
          if (role === "EMPLOYEE") {
            if (ADMIN_ONLY_ROUTES.includes(item.href) || item.href === "/dashboard") return null;
          } else {
            if (item.href === "/staff-dashboard" || item.href === "/staff-dashboard/activity") return null;
          }

          const isActive = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/staff-dashboard" && item.href !== "/activity" && item.href !== "/staff-dashboard/activity" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Sidebar: Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Account
        </div>
        <Link
          href="/profile"
          onClick={onItemClick}
          className={cn(
            "group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all",
            pathname === "/profile"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          )}
        >
          <div className="flex items-center gap-3">
            <User className="size-4 shrink-0 text-slate-400 group-hover:text-white" />
            <span>Profile</span>
          </div>
          <ChevronRight className="size-3 text-slate-500 group-hover:text-slate-300" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

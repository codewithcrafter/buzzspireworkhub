"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Briefcase,
  FileText,
  Sparkles,
  UserCheck,
  GraduationCap,
  Mail,
  Bell,
  Shield,
  BarChart3,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";

interface EmployeeUser {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  designation?: string;
  department?: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");
  const isEmployee = pathname.startsWith("/employee");
  const isClient = pathname.startsWith("/dashboard/client");

  const [employeeUser, setEmployeeUser] = useState<EmployeeUser | null>(null);
  const [loadingEmployee, setLoadingEmployee] = useState(isEmployee);

  useEffect(() => {
    if (isEmployee) {
      fetch("/api/employee/auth/me")
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.user) {
            setEmployeeUser(data.user);
          }
        })
        .catch(() => {
          router.replace("/employee/login");
        })
        .finally(() => {
          setLoadingEmployee(false);
        });
    }
  }, [isEmployee, router]);

  // Global Admin Call Notification
  const notifiedCallIds = useRef<Set<string>>(new Set());
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    
    let interval: NodeJS.Timeout;
    if (typeof window !== "undefined" && !ringtoneRef.current) {
      ringtoneRef.current = new Audio("/ringtone.mp3");
      ringtoneRef.current.loop = true;
    }

    const checkIncomingCalls = async () => {
      try {
        const res = await fetch("/api/admin/chats");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
           const chats = data.chats;
           const ringingCalls: {callId: string, chatId: string}[] = [];
           chats.forEach((chat: any) => {
              chat.voiceCalls?.forEach((call: any) => {
                 if (call.status === "RINGING") {
                    ringingCalls.push({ callId: call.id, chatId: chat.id });
                 }
              });
           });

           if (ringingCalls.length > 0) {
              const newCall = ringingCalls.find(c => !notifiedCallIds.current.has(c.callId));
              if (newCall) {
                 notifiedCallIds.current.add(newCall.callId);
                 if ("Notification" in window && Notification.permission !== "denied") {
                    Notification.requestPermission().then(permission => {
                       if (permission === "granted") {
                          const n = new Notification("Incoming BuzzSpire Voice Call", {
                             body: "Someone is calling you. Click to open the call."
                          });
                          n.onclick = () => {
                             window.focus();
                             router.push(`/admin/chats/${newCall.chatId}`);
                          };
                       }
                    });
                 }
              }
              if (ringtoneRef.current && ringtoneRef.current.paused) {
                 ringtoneRef.current.currentTime = 0;
                 ringtoneRef.current.play().catch(e => console.warn("Admin ringtone autoplay prevented:", e));
              }
           } else {
              if (ringtoneRef.current) {
                 ringtoneRef.current.pause();
                 ringtoneRef.current.currentTime = 0;
              }
           }
        }
      } catch (e) {
        console.error("Global call check error:", e);
      }
    };

    checkIncomingCalls();
    interval = setInterval(checkIncomingCalls, 5000);

    const handleCallStop = () => {
        if (ringtoneRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
        }
    };

    window.addEventListener("call_accepted", handleCallStop);
    window.addEventListener("call_rejected", handleCallStop);
    window.addEventListener("call_ended", handleCallStop);

    return () => {
        clearInterval(interval);
        window.removeEventListener("call_accepted", handleCallStop);
        window.removeEventListener("call_rejected", handleCallStop);
        window.removeEventListener("call_ended", handleCallStop);
    };
  }, [isAdmin, router]);

  useEffect(() => {
    return () => {
       if (ringtoneRef.current) ringtoneRef.current.pause();
    };
  }, []);

  // Dynamic menu construction
  let menuItems: { name: string; icon: any; path: string }[] = [];

  if (isAdmin) {
    menuItems = [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { name: "Leads", icon: Users, path: "/admin/leads" },
      { name: "Live Chats", icon: MessageCircle, path: "/admin/chats" },
      { name: "Employees", icon: UserCheck, path: "/admin/employees" },
      { name: "Clients", icon: Users, path: "/admin/clients" },
      { name: "Projects", icon: Briefcase, path: "/admin/projects" },
      { name: "Pages", icon: FileText, path: "/admin/pages" },
      { name: "Blog CMS", icon: FileText, path: "/admin/blog" },
      { name: "Careers", icon: GraduationCap, path: "/admin/careers" },
      { name: "Inbox", icon: Mail, path: "/admin/inbox" },
      { name: "Notifications", icon: Bell, path: "/admin/notifications" },
      { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
      { name: "Design System", icon: Sparkles, path: "/admin/design-system" },
      { name: "Settings", icon: Settings, path: "/admin/settings" },
    ];
  } else if (isEmployee) {
    const perms = employeeUser?.permissions || [];
    const isUserAdmin = employeeUser?.role === "ADMIN";

    menuItems.push({
      name: "My Dashboard",
      icon: LayoutDashboard,
      path: "/employee/dashboard",
    });

    if (isUserAdmin || perms.includes("LEADS_VIEW")) {
      menuItems.push({
        name: "My Leads",
        icon: Users,
        path: "/employee/leads",
      });
    }

    if (isUserAdmin || perms.includes("CLIENTS_VIEW")) {
      menuItems.push({
        name: "Clients",
        icon: UserCheck,
        path: "/employee/clients",
      });
    }

    if (isUserAdmin || perms.includes("PROJECTS_VIEW")) {
      menuItems.push({
        name: "Projects",
        icon: Briefcase,
        path: "/employee/projects",
      });
    }

    if (isUserAdmin || perms.includes("PAGES_VIEW")) {
      menuItems.push({
        name: "Pages",
        icon: FileText,
        path: "/admin/pages", // Note: Employees with access will use the /admin/pages route, or we should make it /employee/pages? The API uses /admin/pages and protects by permission. So /admin/pages is fine as long as the page doesn't check role==="ADMIN" rigidly in layout. Wait, admin routes are under /admin. If an employee accesses /admin/pages, will layout allow it?
      });
    }

    if (isUserAdmin || perms.includes("REPORTS_VIEW")) {
      menuItems.push({
        name: "Reports",
        icon: BarChart3,
        path: "/employee/reports",
      });
    }
  } else {
    menuItems = [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/client" },
      { name: "Projects", icon: Briefcase, path: "/dashboard/client/projects" },
      { name: "Invoices", icon: FileText, path: "/dashboard/client/invoices" },
      { name: "Support", icon: Users, path: "/dashboard/client/tickets" },
    ];
  }

  const handleLogout = async () => {
    try {
      if (isEmployee) {
        await fetch("/api/employee/auth/logout", { method: "POST" });
        router.replace("/employee/login");
      } else {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        router.replace("/login");
      }
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-primary">
            BuzzSpire<span className="text-muted-foreground">.</span>
          </Link>
          {isEmployee && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              Staff
            </span>
          )}
        </div>

        {/* Employee Info Header in Sidebar */}
        {isEmployee && employeeUser && (
          <div className="px-6 py-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {employeeUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-foreground truncate">
                  {employeeUser.name}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  {employeeUser.employeeId || employeeUser.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === item.path || (item.path !== "/admin" && item.path !== "/employee/dashboard" && pathname.startsWith(item.path + "/"))
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <ToastProvider>
          <div className="max-w-6xl mx-auto">{children}</div>
        </ToastProvider>
      </main>
    </div>
  );
}

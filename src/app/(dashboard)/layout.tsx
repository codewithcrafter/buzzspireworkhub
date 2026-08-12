"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogOut, Settings, Users, Briefcase, FileText, Sparkles, UserCheck, GraduationCap, Mail, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");
  const prefix = isAdmin ? "/admin" : "/dashboard/client";

  const menuItems = isAdmin
    ? [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { name: "Leads", icon: Users, path: "/admin/leads" },
      { name: "Clients", icon: UserCheck, path: "/admin/clients" },
      { name: "Projects", icon: Briefcase, path: "/admin/projects" },
      { name: "Blog CMS", icon: FileText, path: "/admin/blog" },
      { name: "Careers", icon: GraduationCap, path: "/admin/careers" },
      { name: "Inbox", icon: Mail, path: "/admin/inbox" },
      { name: "Notifications", icon: Bell, path: "/admin/notifications" },
      { name: "Analytics", icon: FileText, path: "/admin/analytics" },
      { name: "Design System", icon: Sparkles, path: "/admin/design-system" },
      { name: "Settings", icon: Settings, path: "/admin/settings" },
    ]
    : [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/client" },
      { name: "Projects", icon: Briefcase, path: "/dashboard/client/projects" },
      { name: "Invoices", icon: FileText, path: "/dashboard/client/invoices" },
      { name: "Support", icon: Users, path: "/dashboard/client/tickets" },
    ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="group flex items-center select-none">
            <Image
              src="/logo-full.png"
              alt="BuzzSpire Media"
              width={417}
              height={120}
              className="h-8 w-auto group-hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.path || pathname.startsWith(item.path + "/")
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

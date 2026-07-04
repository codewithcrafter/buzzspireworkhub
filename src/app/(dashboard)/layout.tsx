"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Settings, Users, Briefcase, FileText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");
  const prefix = isAdmin ? "/admin" : "/client";

  const menuItems = isAdmin
    ? [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { name: "Leads", icon: Users, path: "/admin/leads" },
      { name: "Analytics", icon: FileText, path: "/admin/analytics" },
      { name: "Settings", icon: Settings, path: "/admin/settings" },
    ]
    : [
      { name: "Dashboard", icon: LayoutDashboard, path: "/client" },
      { name: "Projects", icon: Briefcase, path: "/client/projects" },
      { name: "Invoices", icon: FileText, path: "/client/invoices" },
      { name: "Support", icon: Users, path: "/client/tickets" },
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
          <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-primary">
            BuzzSpire<span className="text-muted-foreground">.</span>
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

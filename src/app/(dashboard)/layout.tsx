"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { X } from "lucide-react";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative flex flex-col w-64 max-w-xs h-full bg-slate-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="size-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

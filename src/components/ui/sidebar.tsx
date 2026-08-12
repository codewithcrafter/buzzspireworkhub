"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarItem {
  name: string
  icon: React.ComponentType<any>
  path: string
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  menuItems: SidebarItem[]
  logoText?: string
  footer?: React.ReactNode
}

function Sidebar({
  className,
  menuItems,
  logoText = "BuzzSpire",
  footer,
  ...props
}: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-500 ease-in-out h-screen sticky top-0 shrink-0 z-20",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {/* Brand logo & Collapsible Switcher */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/60">
        {!isCollapsed && (
          <Link href="/" className="group flex items-center select-none">
            <Image
              src="/logo-full.png"
              alt="BuzzSpire Media"
              width={417}
              height={120}
              className="h-7 w-auto group-hover:opacity-80 transition-opacity"
            />
          </Link>
        )}
        {isCollapsed && (
          <div className="mx-auto text-primary font-bold text-xl">
            <Sparkles className="size-6 text-primary fill-primary/10 animate-pulse" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground hidden md:block transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/")
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 font-medium",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active Background Highlight Slider */}
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <item.icon className={cn("size-5 shrink-0 transition-transform duration-300 group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border/60">
        {footer ? (
          footer
        ) : (
          <div className="flex items-center gap-3 justify-center min-h-[40px]">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 w-full text-xs text-muted-foreground">
                <div className="size-6 bg-muted rounded-full flex items-center justify-center font-bold font-sans">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">BuzzSpire Media</p>
                  <p className="text-[10px] text-muted-foreground truncate">v1.0.0 (Premium)</p>
                </div>
              </div>
            ) : (
              <div className="size-6 bg-muted rounded-full flex items-center justify-center font-bold text-xs text-muted-foreground">
                B
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

export { Sidebar }
export type { SidebarProps, SidebarItem }

"use client"

import * as React from "react"
import Link from "next/link"
import { User, Settings, Keyboard, LogOut, Shield } from "lucide-react"

import { cn } from "@/lib/utils"

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  userName?: string
  userEmail?: string
  onLogout?: () => void
}

function ProfileDropdown({
  className,
  userName = "Jane Doe",
  userEmail = "jane@buzzspire.com",
  onLogout,
  ...props
}: ProfileDropdownProps) {
  return (
    <div
      className={cn(
        "w-56 bg-card border border-border/80 rounded-2xl shadow-xl p-1.5 flex flex-col z-50 select-none",
        className
      )}
      {...props}
    >
      {/* User summary details header */}
      <div className="px-2.5 py-2 border-b border-border/40 mb-1">
        <p className="text-xs font-bold text-foreground font-heading truncate">{userName}</p>
        <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
      </div>

      {/* Menu Options */}
      <div className="space-y-0.5">
        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 px-2.5 py-1.75 text-xs rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground font-medium transition-colors cursor-pointer"
        >
          <User className="size-3.5 text-muted-foreground" />
          <span>My Profile</span>
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2.5 px-2.5 py-1.75 text-xs rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground font-medium transition-colors cursor-pointer"
        >
          <Settings className="size-3.5 text-muted-foreground" />
          <span>Account Settings</span>
        </Link>
        <button
          className="flex items-center justify-between w-full px-2.5 py-1.75 text-xs rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground font-medium transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="size-3.5 text-muted-foreground" />
            <span>Shortcuts</span>
          </div>
          <kbd className="font-mono text-[9px] text-muted-foreground">?</kbd>
        </button>
      </div>

      <div className="h-px bg-border/40 my-1" />

      {/* Logout option */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 px-2.5 py-1.75 text-xs rounded-lg text-destructive hover:bg-destructive/10 font-semibold transition-colors cursor-pointer"
      >
        <LogOut className="size-3.5 text-destructive" />
        <span>Log Out</span>
      </button>
    </div>
  )
}

export { ProfileDropdown }
export type { ProfileDropdownProps }

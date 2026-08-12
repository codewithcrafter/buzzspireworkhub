"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Search, Command } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearchClick?: () => void
  onNotificationsClick?: () => void
  onProfileClick?: () => void
  userName?: string
  userEmail?: string
  userAvatarSrc?: string
  notificationCount?: number
  profileDropdown?: React.ReactNode
  notificationDropdown?: React.ReactNode
}

function Navbar({
  className,
  onSearchClick,
  onNotificationsClick,
  onProfileClick,
  userName = "Jane Doe",
  userEmail = "jane@buzzspire.com",
  userAvatarSrc,
  notificationCount = 3,
  profileDropdown,
  notificationDropdown,
  ...props
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  const notifRef = React.useRef<HTMLDivElement>(null)
  const profileRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300",
        className
      )}
      {...props}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left section: Breadcrumb placeholder or greeting */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">BuzzSpire Media</span>
            <span className="text-sm font-semibold text-foreground">Premium Design Workspace</span>
          </div>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-4">
          {/* Search Trigger Button */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/60 border border-border/60 rounded-lg hover:bg-muted transition-all duration-300 w-44 md:w-56 cursor-pointer"
          >
            <Search className="size-3.5" />
            <span className="flex-1 text-left">Search anything...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground/80 opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Notifications Popover Wrapper */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-muted/80 cursor-pointer"
              onClick={() => {
                setShowNotifications(!showNotifications)
                onNotificationsClick?.()
              }}
            >
              <Bell className="size-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex size-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
              )}
            </Button>

            {showNotifications && notificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 z-50 animate-in fade-in slide-in-from-top-3 duration-250">
                {notificationDropdown}
              </div>
            )}
          </div>

          {/* Profile Dropdown Wrapper */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                onProfileClick?.()
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/80 transition-all duration-300 cursor-pointer"
            >
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xs">
                {userName.charAt(0)}
              </div>
            </button>

            {showProfile && profileDropdown && (
              <div className="absolute right-0 mt-2 w-56 z-50 animate-in fade-in slide-in-from-top-3 duration-250">
                {profileDropdown}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
export type { NavbarProps }

"use client"

import { useState } from "react"
import { Search, Settings, ChevronDown, LogOut, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light" | "green">("dark")

  const applyTheme = (selectedTheme: "dark" | "light" | "green") => {
    setTheme(selectedTheme)
    const root = document.documentElement
    if (selectedTheme === "light") {
      root.style.setProperty("--background", "oklch(0.98 0 0)")
      root.style.setProperty("--foreground", "oklch(0.15 0 0)")
      root.style.setProperty("--card", "oklch(0.95 0 0)")
      root.style.setProperty("--sidebar", "oklch(0.93 0 0)")
      root.style.setProperty("--sidebar-foreground", "oklch(0.15 0 0)")
      root.style.setProperty("--sidebar-accent", "oklch(0.88 0 0)")
    } else if (selectedTheme === "green") {
      root.style.setProperty("--background", "oklch(0.15 0.08 142.5)")
      root.style.setProperty("--foreground", "oklch(0.98 0 0)")
      root.style.setProperty("--card", "oklch(0.22 0.08 142.5)")
      root.style.setProperty("--sidebar", "oklch(0.18 0.08 142.5)")
      root.style.setProperty("--sidebar-foreground", "oklch(0.98 0 0)")
      root.style.setProperty("--sidebar-accent", "oklch(0.3 0.08 142.5)")
    } else {
      root.style.setProperty("--background", "oklch(0.15 0 0)")
      root.style.setProperty("--foreground", "oklch(0.98 0 0)")
      root.style.setProperty("--card", "oklch(0.22 0 0)")
      root.style.setProperty("--sidebar", "oklch(0.22 0 0)")
      root.style.setProperty("--sidebar-foreground", "oklch(0.98 0 0)")
      root.style.setProperty("--sidebar-accent", "oklch(0.35 0 0)")
    }
  }

  return (
    <header className="bg-sidebar border-b border-sidebar-border h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left section - Logo and Home */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-sidebar-foreground">GYMMASTER</h1>
          <span className="text-sidebar-accent-foreground text-sm font-medium">Home</span>
        </div>
      </div>



      <div className="flex items-center gap-4">

        {/* Profile Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 h-8 px-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-white overflow-hidden">
              <img src="/male-user-avatar.png" alt="Curtis" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium">Curtis</span>
            <ChevronDown className="w-4 h-4 text-sidebar-accent-foreground" />
          </Button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-sidebar-accent border border-sidebar-border rounded-md shadow-lg z-50">
              <Link
                href="/profile"
                className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent flex items-center gap-2 block"
              >
                <span>Profile</span>
              </Link>
              <Link
                href="/my-account"
                className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent flex items-center gap-2 block"
              >
                <span>My Account</span>
              </Link>
              <hr className="border-sidebar-border my-1" />
              <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-sidebar hover:text-accent flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="flex items-center gap-2 h-8 px-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
            <ChevronDown className="w-4 h-4 text-sidebar-accent-foreground" />
          </Button>

          {showSettingsMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-sidebar-accent border border-sidebar-border rounded-md shadow-lg z-50">
              <div className="px-4 py-3 border-b border-sidebar-border">
                <p className="text-xs font-semibold text-sidebar-foreground uppercase">Theme</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => applyTheme("dark")}
                    className={`flex-1 px-2 py-1 text-xs rounded border ${theme === "dark"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-sidebar-border text-sidebar-foreground hover:bg-sidebar"
                      }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => applyTheme("light")}
                    className={`flex-1 px-2 py-1 text-xs rounded border ${theme === "light"
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-sidebar-border text-sidebar-foreground hover:bg-sidebar"
                      }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => applyTheme("green")}
                    className={`flex-1 px-2 py-1 text-xs rounded border ${theme === "green"
                      ? "bg-green-500 text-white border-green-500"
                      : "border-sidebar-border text-sidebar-foreground hover:bg-sidebar"
                      }`}
                  >
                    Green
                  </button>
                </div>
              </div>
              <Link
                href="/billing"
                className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent block"
              >
                Billing
              </Link>
              <button className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent">
                Account Settings
              </button>
              <Link
                href="/notifications"
                className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent block"
              >
                Notifications
              </Link>
              <hr className="border-sidebar-border my-1" />
              <Link
                href="/help-support"
                className="w-full text-left px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar hover:text-accent block"
              >
                Help & Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </header >
  )
}

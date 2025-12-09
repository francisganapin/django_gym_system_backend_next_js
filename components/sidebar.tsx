"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  UserPlus,
  Users,
  Calendar,
  ShoppingCart,
  BarChart3,
  CheckSquare,
  Package,
  UserCheck,
  LogIn,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: UserPlus, label: "Add Member", href: "/add-member" },
    { icon: Users, label: "Visitors", href: "/visitors" },
    { icon: Calendar, label: "Schedule", href: "/schedule" },
    { icon: ShoppingCart, label: "Point of Sale", href: "/point-of-sale" },
    { icon: BarChart3, label: "Report & Till", href: "/report-till" },
    { icon: CheckSquare, label: "Task", href: "/task" },
    { icon: Package, label: "Stock", href: "/stock" },
    { icon: UserCheck, label: "Member Portal", href: "/member-portal" },
    { icon: LogIn, label: "Login Portal", href: "/login-portal" },
    // Billing and Help & Support removed from sidebar
  ]

  return (
    <aside className="w-32 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-bold text-sidebar-primary text-sm">GYM</h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors text-xs text-center ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

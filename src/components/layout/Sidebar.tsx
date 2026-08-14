"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wrench,
  Receipt,
  Boxes,
  BarChart3,
  Car,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/diary", label: "Diary", icon: CalendarDays },
  { href: "/jobs", label: "Job Cards", icon: Wrench },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white">
          <Car size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            My Garage CRM
          </p>
          <p className="text-xs text-neutral-500">MVP Console</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-neutral-100 px-5 py-4">
        <p className="text-xs text-neutral-400">
          Frontend MVP &middot; Supabase not yet connected
        </p>
      </div>
    </aside>
  );
}

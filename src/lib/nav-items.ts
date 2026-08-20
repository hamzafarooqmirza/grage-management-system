import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Receipt,
  Boxes,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Job Cards nav tab is temporarily hidden — re-add the entry below to restore it:
// { href: "/jobs", label: "Job Cards", icon: Wrench },
export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/diary", label: "Bookings", icon: CalendarDays },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

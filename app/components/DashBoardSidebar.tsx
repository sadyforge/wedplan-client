"use client"

import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

type UserRole = "customer" | "vendor" | "admin"

type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  customer: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", url: "/dashboard/bookings", icon: CalendarCheck },
    { name: "Profile Settings", url: "/profile", icon: Settings },
  ],
  vendor: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { name: "My Services", url: "/dashboard/services", icon: Wrench },
    { name: "Add Service", url: "/dashboard/services/add", icon: Plus },
    { name: "Booking Requests", url: "/dashboard/bookings", icon: ListChecks },
    { name: "Subscription", url: "/dashboard/subscription", icon: CreditCard },
    { name: "Profile Settings", url: "/profile", icon: Settings },
  ],
  admin: [
    { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", url: "/dashboard/users", icon: Users },
    { name: "Manage Services", url: "/dashboard/services", icon: ShieldCheck },
    { name: "Transactions", url: "/dashboard/transactions", icon: CreditCard },
  ],
}

function isUserRole(role: unknown): role is UserRole {
  return role === "customer" || role === "vendor" || role === "admin"
}

export function DashBoardSidebar() {
  const { data: session, isPending } = useSession()
  const role = (session?.user as { role?: unknown } | undefined)?.role

  if (isPending) {
    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span>Loading menu...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }

  if (!session?.user || !isUserRole(role)) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton render={<a href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

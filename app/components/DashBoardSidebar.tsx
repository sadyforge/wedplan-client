"use client"

import {
  CalendarCheck,
  CreditCard,
  Heart,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

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
    { name: "Manage Users", url: "/dashboard/admin/manage-users", icon: Users },
    { name: "Manage Services", url: "/dashboard/admin/services", icon: ShieldCheck },
    { name: "Transactions", url: "/dashboard/transactions", icon: CreditCard },
    { name: "Profile Settings", url: "/profile", icon: Settings },
  ],
}

function isUserRole(role: unknown): role is UserRole {
  return role === "customer" || role === "vendor" || role === "admin"
}

export function DashBoardSidebar() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenMobile } = useSidebar()
  const role = (session?.user as { role?: unknown } | undefined)?.role

  const closeMobileSidebar = () => setOpenMobile(false)

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()

    if (error) {
      toast.error(error.message || "Sign out failed!")
      return
    }

    closeMobileSidebar()
    toast.success("Successfully signed out!")
    router.push("/")
  }

  if (isPending) {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <Heart className="h-5 w-5 fill-[#C98291] text-[#C98291]" />
            <span className="text-lg font-bold text-[#302925]">
              Wed<span className="text-[#C98291]">Plan</span>
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span>Loading dashboard...</span>
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

  const userName = session.user.name || "WedPlan User"
  const userImage = session.user.image
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link
          href="/"
          onClick={closeMobileSidebar}
          className="flex items-center gap-2"
        >
          <Heart className="h-6 w-6 fill-[#C98291] text-[#C98291]" />
          <span className="text-xl font-bold tracking-tight text-[#302925]">
            Wed<span className="text-[#C98291]">Plan</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  render={
                    <Link href={item.url} onClick={closeMobileSidebar} />
                  }
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4E6E2] text-sm font-bold text-[#B66F7F]">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#302925]">
              {userName}
            </p>
            <p className="text-xs text-[#897A72]">{roleLabel}</p>
          </div>
        </div>

        <SidebarMenuButton
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}

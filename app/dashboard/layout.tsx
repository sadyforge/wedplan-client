import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashBoardSidebar } from "../components/DashBoardSidebar"
import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole()

  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden">
      <DashBoardSidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

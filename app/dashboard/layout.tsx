import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashBoardSidebar } from "../components/DashBoardSidebar"
import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireDashboardRole()

  return (
    <SidebarProvider>
      <DashBoardSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
   
    </SidebarProvider>
  )
}

import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashBoardSidebar } from "../components/DashBoardSidebar"
import { Plus } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
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
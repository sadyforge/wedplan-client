import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function DashboardPage() {
  await requireDashboardRole()

  return <div>Dashboard overview</div>
}

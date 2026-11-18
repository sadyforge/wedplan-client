import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function AddServicePage() {
  await requireDashboardRole(["vendor"])

  return <div>Add service</div>
}

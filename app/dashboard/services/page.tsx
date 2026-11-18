import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function ServicesPage() {
  await requireDashboardRole(["vendor", "admin"])

  return <div>Services</div>
}

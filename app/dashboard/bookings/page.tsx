import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function BookingsPage() {
  await requireDashboardRole(["customer", "vendor"])

  return <div>Bookings</div>
}

import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function SubscriptionPage() {
  await requireDashboardRole(["vendor"])

  return <div>Subscription</div>
}

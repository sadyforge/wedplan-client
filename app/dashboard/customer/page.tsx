import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

const CustomerPage = async () => {
  await requireDashboardRole(["customer"])

  return <div>CustomerPage</div>
}

export default CustomerPage

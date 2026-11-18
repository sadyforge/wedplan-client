import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

const VendorPage = async () => {
  await requireDashboardRole(["vendor"])

  return <div>VendorPage</div>
}

export default VendorPage

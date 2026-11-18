import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

const AdminPage = async () => {
  await requireDashboardRole(["admin"])

  return <div>AdminPage</div>
}

export default AdminPage

import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function UsersPage() {
  await requireDashboardRole(["admin"])

  return <div>Manage users</div>
}

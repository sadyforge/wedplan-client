import { requireDashboardRole } from "@/lib/dashboard-auth"

export const instant = false

export default async function TransactionsPage() {
  await requireDashboardRole(["admin"])

  return <div>Transactions</div>
}

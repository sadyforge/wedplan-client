import { requireDashboardRole } from "@/lib/dashboard-auth";
import TransactionsTable from "./TransactionsTable";

export const instant = false;

export default async function TransactionsPage() {
  await requireDashboardRole(["admin"]);
  return <TransactionsTable />;
}

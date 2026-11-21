import { requireDashboardRole } from "@/lib/dashboard-auth";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardRole(["admin"]);
  return children;
}

import { redirect } from "next/navigation";
import { requireDashboardRole } from "@/lib/dashboard-auth";

export const instant = false;

// Dashboard root is a role-aware entry point: it sends each signed-in user to
// their own dashboard instead of rendering a blank page. The actual dashboards
// live under /dashboard/vendor, /dashboard/customer and /dashboard/admin.
export default async function DashboardEntry() {
  const { role } = await requireDashboardRole();

  if (role === "admin") redirect("/dashboard/admin");
  if (role === "vendor") redirect("/dashboard/vendor");
  redirect("/dashboard/customer");
}

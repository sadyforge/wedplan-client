import { requireRole } from "@/lib/core/server";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole('admin');
  return children;
}

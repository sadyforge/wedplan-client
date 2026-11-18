import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export type UserRole = "customer" | "vendor" | "admin"

function isUserRole(role: unknown): role is UserRole {
  return role === "customer" || role === "vendor" || role === "admin"
}

export async function requireDashboardRole(
  allowedRoles: readonly UserRole[] = ["customer", "vendor", "admin"],
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/sign-in")
  }

  const role = (session.user as { role?: unknown }).role

  if (!isUserRole(role)) {
    redirect("/")
  }

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard")
  }

  return { session, role }
}

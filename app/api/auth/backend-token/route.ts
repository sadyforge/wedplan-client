import { NextResponse } from "next/server";
import { createBackendToken, getSession } from "@/lib/core/server";

export async function POST() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("backend_token", await createBackendToken(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("backend_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}

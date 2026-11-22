"use server";

import { createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const jwtIssuer = process.env.BACKEND_JWT_ISSUER || "wedplan-client";
const jwtAudience = process.env.BACKEND_JWT_AUDIENCE || "wedplan-api";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

const base64UrlEncode = (value: string) =>
  Buffer.from(value).toString("base64url");

const signJwt = (payload: Record<string, unknown>) => {
  const secret = process.env.BACKEND_JWT_SECRET;
  if (!secret) throw new Error("BACKEND_JWT_SECRET is not configured.");

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${header}.${body}`;
  const signature = createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
};

export const createBackendToken = async (session: Session) => {
  if (!session?.user?.id) throw new Error("Authenticated session is required.");
  const now = Math.floor(Date.now() / 1000);
  return signJwt({
    sub: session.user.id,
    iat: now,
    exp: now + 15 * 60,
    iss: jwtIssuer,
    aud: jwtAudience,
  });
};

export const getSession = async (): Promise<Session> =>
  auth.api.getSession({ headers: await headers() });

// Kept as a compatibility alias for existing server routes.
export const getSessions = getSession;

export const getToken = async () => {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const storedToken = (await cookies()).get("backend_token")?.value;
  if (storedToken) return storedToken;
  return createBackendToken(session);
};

export const authFetch = async (api: string, init: RequestInit = {}) => {
  const token = await getToken();
  const providedHeaders = new Headers(init.headers);
  providedHeaders.set("Authorization", `Bearer ${token}`);

  return fetch(api, {
    ...init,
    headers: providedHeaders,
    cache: init.cache || "no-store",
  });
};

export const protectedMutation = async (
  api: string,
  method: string,
  data?: unknown,
) =>
  authFetch(api, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });

export const requireRole = async (role: string) => {
  const session = await getSession();
  if (
    !session?.user ||
    (session.user as typeof session.user & { role?: string }).role !== role
  )
    redirect("/unauthorized");
  return session;
};

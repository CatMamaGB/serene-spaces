import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

/** Authenticated session (user guaranteed when used after guard). */
type AuthSession = Session & { user: NonNullable<Session["user"]> };

/**
 * Require any authenticated admin session (staff or admin).
 */
export async function requireAuth(): Promise<
  | { authSession: AuthSession; response: null }
  | { authSession: null; response: NextResponse }
> {
  const s = await auth();
  if (!s?.user) {
    return {
      authSession: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { authSession: s, response: null };
}

/**
 * Require role admin (destructive operations: deletes, etc.).
 */
export async function requireAdmin(): Promise<
  | { authSession: AuthSession; response: null }
  | { authSession: null; response: NextResponse }
> {
  const s = await auth();
  if (!s?.user) {
    return {
      authSession: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (s.user.role !== "admin") {
    return {
      authSession: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { authSession: s, response: null };
}

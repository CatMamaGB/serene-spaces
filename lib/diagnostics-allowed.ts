import { NextResponse } from "next/server";

/**
 * Diagnostic/test routes should not run in production.
 * Optional override: ALLOW_DIAGNOSTICS=true (e.g. temporary Vercel env).
 */
export function diagnosticsNotAllowedResponse(): NextResponse | null {
  const allow =
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_DIAGNOSTICS === "true";
  if (allow) return null;
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

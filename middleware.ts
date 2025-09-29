import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  // Force immediate logging to ensure we see this
  console.log("=".repeat(50));
  console.log("🚀 MIDDLEWARE VERSION 7.1 - USING NextAuth MIDDLEWARE WRAPPER");
  console.log("🕐 TIMESTAMP:", new Date().toISOString());
  console.log("📍 PATH:", req.nextUrl.pathname);
  console.log("🔐 SESSION:", !!req.auth?.user);
  console.log("=".repeat(50));

  // Skip middleware for auth API routes to prevent infinite loops
  if (req.nextUrl.pathname.startsWith("/api/auth/")) {
    console.log("⏭️ Skipping auth API routes");
    return NextResponse.next();
  }

  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  console.log("🌐 Host check:", {
    host,
    isApex: host === "loveserenespaces.com",
  });

  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    console.log("🔄 Redirecting apex to www:", url.toString());
    return NextResponse.redirect(url);
  }

  // Only run auth check on admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔍 ADMIN ROUTE - Authentication check");
    console.log("🔐 Auth object:", {
      isAuthenticated: !!req.auth?.user,
      userEmail: req.auth?.user?.email,
      userId: req.auth?.user?.id,
      userRole: (req.auth?.user as any)?.role,
    });

    if (!req.auth?.user) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      console.log(
        "❌ NO VALID SESSION - Redirecting to signin:",
        url.toString(),
      );
      return NextResponse.redirect(url);
    }

    console.log("✅ SESSION VALID - Allowing access to admin");
  }

  console.log("➡️ Middleware complete - proceeding to next");
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
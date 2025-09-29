import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes that need to work independently
  const apiRoute = req.nextUrl.pathname.startsWith("/api/");
  if (apiRoute) {
    console.log("⏭️ Skipping API route:", req.nextUrl.pathname);
    return NextResponse.next();
  }

  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    console.log("🔄 Redirecting apex to www:", url.toString());
    return NextResponse.redirect(url);
  }

  // Only authenticate admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔍 ADMIN ROUTE - Authentication check");

    try {
      const session = await auth();
      console.log("🔐 Session check:", {
        isAuthenticated: !!session?.user,
        userEmail: session?.user?.email,
        userId: session?.user?.id,
        userRole: (session?.user as any)?.role,
      });

      if (!session?.user) {
        const url = new URL("/auth/signin", req.url);
        url.searchParams.set("callbackUrl", req.url);
        console.log("❌ NO VALID SESSION - Redirecting to signin:", url.toString());
        return NextResponse.redirect(url);
      }

      console.log("✅ SESSION VALID - Allowing access to admin");
    } catch (error) {
      console.error("❌ Session validation error:", error);
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
  }

  console.log("➡️ Middleware complete - proceeding to next");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
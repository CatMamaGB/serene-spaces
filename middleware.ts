import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  // Force immediate logging to ensure we see this
  console.log("=".repeat(50));
  console.log("🚀 NEW MIDDLEWARE VERSION 5.0 - USING AUTH FUNCTION");
  console.log("🕐 TIMESTAMP:", new Date().toISOString());
  console.log("📍 PATH:", req.nextUrl.pathname);
  console.log("=".repeat(50));
  
  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  console.log("🌐 Host check:", { host, isApex: host === "loveserenespaces.com" });
  
  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    console.log("🔄 Redirecting apex to www:", url.toString());
    return NextResponse.redirect(url);
  }

  console.log("🔒 Processing request:", {
    pathname: req.nextUrl.pathname,
    host: host,
    isAdminRoute: req.nextUrl.pathname.startsWith("/admin"),
  });

  if (req.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔍 ADMIN ROUTE - Starting authentication check...");
    
    // Get all cookies for debugging
    const allCookies = req.cookies.getAll();
    console.log("🍪 All cookies received:", allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    // Check for session cookies
    const secureCookie = req.cookies.get("__Secure-authjs.session-token")?.value
                      ?? req.cookies.get("_Secure-authjs.session-token")?.value;
    const plainCookie = req.cookies.get("authjs.session-token")?.value;

    console.log("🔍 Cookie Analysis:", {
      hasSecureCookie: !!secureCookie,
      hasPlainCookie: !!plainCookie,
      secureCookieLength: secureCookie?.length || 0,
      plainCookieLength: plainCookie?.length || 0,
    });

    console.log("🔑 Attempting session validation with auth()...");
    
    try {
      const session = await auth();
      
      console.log("🔒 Session validation result:", {
        hasSession: !!session,
        sessionUser: session?.user?.email,
        sessionUserId: session?.user?.id,
        sessionUserRole: session?.user?.role,
      });
      
      if (!session || !session.user) {
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
      console.log("❌ SESSION ERROR - Redirecting to signin:", url.toString());
      return NextResponse.redirect(url);
    }
  }
  
  console.log("➡️ Middleware complete - proceeding to next");
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

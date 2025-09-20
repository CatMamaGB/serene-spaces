import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Force immediate logging to ensure we see this
  console.log("=".repeat(50));
  console.log("🚀 MIDDLEWARE EXECUTING FOR:", req.nextUrl.pathname);
  console.log("🔧 MIDDLEWARE VERSION: 3.0 - UPDATED SECRET SYNC TEST");
  console.log("🕐 TIMESTAMP:", new Date().toISOString());
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
    console.log("🔍 ADMIN ROUTE - Starting cookie analysis...");
    
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

    // Check environment
    console.log("🔧 Environment Check:", {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      secretPreview: process.env.NEXTAUTH_SECRET?.substring(0, 8) + "...",
      secretHash: process.env.NEXTAUTH_SECRET ? "SET" : "NOT_SET",
    });

    console.log("🔑 Attempting token validation...");
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log("🔒 Token validation result:", {
      hasToken: !!token,
      tokenEmail: token?.email,
      tokenSub: token?.sub,
      tokenExp: token?.exp,
    });
    
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      console.log("❌ NO VALID TOKEN - Redirecting to signin:", url.toString());
      return NextResponse.redirect(url);
    }
    
    console.log("✅ TOKEN VALID - Allowing access to admin");
  }
  
  console.log("➡️ Middleware complete - proceeding to next");
  return NextResponse.next();
}

export const config = { matcher: [] }; // Temporarily disable middleware

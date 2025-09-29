import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Skip middleware for API routes that need to work independently
  const apiRoute = req.nextUrl.pathname.startsWith("/api/");
  if (apiRoute) {
    return NextResponse.next();
  }

  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    return NextResponse.redirect(url);
  }

  // Only authenticate admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Check for auth session token in cookies
    const sessionToken = req.cookies.get("authjs.session-token") || 
                        req.cookies.get("__Secure-authjs.session-token");
    
    if (!sessionToken) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(url);
    }
  }

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
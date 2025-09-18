import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Check if this is an admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Check for session token in cookies
    const sessionToken = req.cookies.get("authjs.session-token") || 
                        req.cookies.get("__Secure-authjs.session-token");
    
    // If no session token, redirect to sign in
    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

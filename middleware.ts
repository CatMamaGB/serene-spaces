import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("🚀 MIDDLEWARE START:", req.nextUrl.pathname);
  
  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    console.log("🔄 Redirecting to www:", url.toString());
    return NextResponse.redirect(url);
  }

  console.log("🔒 Middleware check:", {
    pathname: req.nextUrl.pathname,
    host: host,
  });

  if (req.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔍 ADMIN ROUTE DETECTED - Starting diagnostics...");
    
    // Diagnostic logging to debug cookie/secret issues
    const secure = req.cookies.get("__Secure-authjs.session-token")?.value
                ?? req.cookies.get("_Secure-authjs.session-token")?.value;
    const plain = req.cookies.get("authjs.session-token")?.value;

    console.log("EDGE DEBUG - Cookie Analysis:", {
      path: req.nextUrl.pathname,
      hasSecureCookie: !!secure,
      hasPlainCookie: !!plain,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      host: req.headers.get("host"),
      allCookies: Array.from(req.cookies.getAll()).map(c => c.name),
    });

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log("🔒 Token check result:", {
      hasToken: !!token,
      tokenEmail: token?.email,
      tokenSub: token?.sub,
    });
    
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      console.log("🔄 NO TOKEN - Redirecting to signin:", url.toString());
      return NextResponse.redirect(url);
    }
    
    console.log("✅ TOKEN VALID - Proceeding to admin page");
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

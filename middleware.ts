import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Enforce www host to prevent cookie domain mismatches
  const host = req.headers.get("host");
  if (host === "loveserenespaces.com") {
    const url = new URL(req.url);
    url.host = "www.loveserenespaces.com";
    return NextResponse.redirect(url);
  }

  console.log("🔒 Middleware check:", {
    pathname: req.nextUrl.pathname,
  });

  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Diagnostic logging to debug cookie/secret issues
    const secure = req.cookies.get("__Secure-authjs.session-token")?.value
                ?? req.cookies.get("_Secure-authjs.session-token")?.value;
    const plain = req.cookies.get("authjs.session-token")?.value;

    console.log("EDGE DEBUG", {
      path: req.nextUrl.pathname,
      hasSecureCookie: !!secure,
      hasPlainCookie: !!plain,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      host: req.headers.get("host"),
    });

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    console.log("🔒 Token check:", {
      hasToken: !!token,
      tokenEmail: token?.email,
    });
    
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", req.url);
      console.log("🔄 Redirecting to signin:", url.toString());
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("🔒 Middleware check:", {
    pathname: req.nextUrl.pathname,
  });

  if (req.nextUrl.pathname.startsWith("/admin")) {
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

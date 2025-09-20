import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cookieStore = await cookies();
  
  // Get all cookies
  const allCookies = cookieStore.getAll();
  
  // Check for session cookies
  const secureCookie = cookieStore.get("__Secure-authjs.session-token")?.value
                    ?? cookieStore.get("_Secure-authjs.session-token")?.value;
  const plainCookie = cookieStore.get("authjs.session-token")?.value;

  // Try to get token
  let token = null;
  try {
    // Create a mock request object for getToken
    const mockReq = {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value || null,
      },
      headers: {
        get: () => null,
      },
      url: "https://www.loveserenespaces.com/admin",
    } as any;
    
    token = await getToken({
      req: mockReq,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch (error) {
    console.error("Token validation error:", error);
  }

  return NextResponse.json({
    message: "Middleware test API route",
    timestamp: new Date().toISOString(),
    environment: {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      secretPreview: process.env.NEXTAUTH_SECRET?.substring(0, 8) + "...",
    },
    cookies: {
      allCookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
      hasSecureCookie: !!secureCookie,
      hasPlainCookie: !!plainCookie,
      secureCookieLength: secureCookie?.length || 0,
      plainCookieLength: plainCookie?.length || 0,
    },
    token: {
      hasToken: !!token,
      tokenEmail: token?.email,
      tokenSub: token?.sub,
    },
  });
}

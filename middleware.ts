import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For now, we'll handle authentication in the client-side components
  // This avoids Edge Runtime issues with NextAuth
  // The admin layout will handle authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

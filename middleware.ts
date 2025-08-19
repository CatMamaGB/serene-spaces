import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // For now, we'll skip auth in middleware and handle it in the pages
  // This avoids Edge Runtime issues with NextAuth
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Force Node.js runtime and disable caching
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function saveRefreshTokenToDB(userId: string, refreshToken: string) {
  await (prisma as any).gmailCredential.upsert({
    where: { userId },
    update: { refreshToken },
    create: { userId, refreshToken },
  });
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
      return NextResponse.redirect(new URL("/auth/signin?return=/admin", base), { status: 303 });
    }

    const params = new URL(req.url).searchParams;
    const code = params.get("code");
    const state = params.get("state");
    const cookieState = req.cookies.get("gmail_oauth_state")?.value;

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }
    
    if (!state || !cookieState || state !== cookieState) {
      return NextResponse.json({ error: "Invalid state" }, { status: 400 });
    }

    // Build redirect URI from request origin
    const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
    const redirectUri = `${base}/api/gmail/callback/google`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri,
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      // Most common causes: not using prompt=consent + access_type=offline,
      // or you've already authorized before. Revoke at myaccount.google.com/permissions and try again.
      return NextResponse.json(
        {
          error:
            "No refresh_token returned. Please revoke access at myaccount.google.com/permissions and try again.",
        },
        { status: 400 },
      );
    }

    // Use the authenticated user's ID
    const userId = (session.user as any).id ?? "admin";

    await saveRefreshTokenToDB(userId, tokens.refresh_token);

    // Clear the state cookie with same attributes
    const response = NextResponse.redirect(new URL("/admin?gmail-connected=1", base), { status: 303 });
    response.cookies.set("gmail_oauth_state", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });
    return response;
  } catch (e: any) {
    console.error("Gmail OAuth callback error", e);
    
    // Handle invalid_grant errors gracefully (re-used/expired codes)
    if (e?.response?.data?.error === "invalid_grant") {
      const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
      return NextResponse.redirect(new URL("/admin?gmail-error=invalid-grant", base), { status: 303 });
    }
    
    // Fallback error handling
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Gmail OAuth callback failed",
        detail: errorMessage,
      },
      { status: 500 },
    );
  }
}

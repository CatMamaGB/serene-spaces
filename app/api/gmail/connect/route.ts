import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { getGmailOAuthRedirectUri, getPublicSiteOrigin } from "@/lib/env-server";

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET(req: Request) {
  // Check authentication
  const session = await auth();
  const reqOrigin = new URL(req.url).origin;

  if (!session?.user?.email) {
    const base = getPublicSiteOrigin(reqOrigin);
    return NextResponse.redirect(new URL("/auth/signin?return=/admin", base), {
      status: 303,
    });
  }

  const redirectUri = getGmailOAuthRedirectUri(reqOrigin);

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  );

  const state = crypto.randomUUID(); // store this server-side or in a signed cookie
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      /** Lets admin /gmail-health call users.getProfile (gmail.send alone does not). */
      "https://www.googleapis.com/auth/gmail.metadata",
    ],
    state,
  });

  const res = NextResponse.redirect(url);
  res.cookies.set("gmail_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });
  return res;
}

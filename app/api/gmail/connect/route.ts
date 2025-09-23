import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/auth";

// Force Node.js runtime
export const runtime = "nodejs";

export async function GET(req: Request) {
  // Check authentication
  const session = await auth();
  if (!session?.user?.email) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    return NextResponse.redirect(new URL("/auth/signin?return=/admin", base), {
      status: 303,
    });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin; // e.g. https://www.loveserenespaces.com

  const redirectUri = `${base}/api/gmail/callback/google`;

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
      // add others only if needed:
      // "https://www.googleapis.com/auth/gmail.modify",
      // "https://www.googleapis.com/auth/userinfo.email",
    ],
    state,
  });

  const res = NextResponse.redirect(url);
  res.cookies.set("gmail_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  });
  return res;
}

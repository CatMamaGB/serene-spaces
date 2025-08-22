import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// TODO: replace with your real persistence (DB/secret manager)
async function saveRefreshTokenToDB(userId: string, refreshToken: string) {
  // For now, we'll use environment variables as a temporary solution
  // In production, you should store this in a secure database or secret manager
  console.log("SAVE THIS SECURELY FOR user:", userId, "token:", refreshToken);

  // TODO: Implement proper storage:
  // - Database table for OAuth tokens
  // - Encrypted storage
  // - User association
}

export async function GET(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // Create OAuth2 client
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      (process.env.NODE_ENV === "production"
        ? "https://www.loveserenespaces.com/api/auth/callback/google"
        : "http://localhost:3000/api/auth/callback/google");

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

    // Identify whose Gmail this is (you can call Google userinfo or let admin connect a single fixed account)
    const userId = "admin"; // replace with real user id if multi-user

    await saveRefreshTokenToDB(userId, tokens.refresh_token);

    // ✅ absolute redirect URL (works in Edge/middleware)
    const base =
      process.env.NEXT_PUBLIC_APP_URL               // e.g. https://www.loveserenespaces.com
      || req.nextUrl.origin;                        // falls back to request origin

    const redirectUrl = new URL("/admin?gmail-connected=1", base);
    return NextResponse.redirect(redirectUrl, { status: 303 }); // 303 = "see other"
  } catch (e: unknown) {
    console.error("OAuth callback error", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      {
        error: "OAuth callback failed",
        detail: errorMessage,
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/gmail-oauth";

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

    const tokens = await exchangeCodeForTokens(code);

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

    // Redirect back to an admin page that can show "Connected"
    return NextResponse.redirect("/admin/gmail-setup?connected=1");
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

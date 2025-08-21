import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, exchangeCodeForTokens } from "@/lib/gmail-oauth";

// Get OAuth2 authorization URL
export async function GET() {
  try {
    const authUrl = getAuthUrl();

    return NextResponse.json({
      success: true,
      authUrl,
      message: "Use this URL to authorize Gmail access",
    });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate authorization URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Exchange authorization code for tokens
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Authorization code is required" },
        { status: 400 },
      );
    }

    const tokens = await exchangeCodeForTokens(code);

    return NextResponse.json({
      success: true,
      message: "Tokens received successfully",
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      },
      nextSteps: [
        "Add GMAIL_REFRESH_TOKEN to your .env.local file",
        "Restart your development server",
        "Test the email functionality",
      ],
    });
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to exchange authorization code",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

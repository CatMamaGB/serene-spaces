import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Determine the correct base URL for the current environment
    const getBaseUrl = () => {
      if (process.env.NODE_ENV === "development") {
        return "http://localhost:3000";
      }
      return process.env.NEXTAUTH_URL || request.nextUrl.origin;
    };

    const baseUrl = getBaseUrl();

    return NextResponse.json({
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
          ? "✅ Set"
          : "❌ Missing",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
          ? "✅ Set"
          : "❌ Missing",
        NODE_ENV: process.env.NODE_ENV,
      },
      urls: {
        baseUrl,
        callbackUrl: `${baseUrl}/api/auth/callback/google`,
        signInUrl: `${baseUrl}/auth/signin`,
        adminUrl: `${baseUrl}/admin`,
      },
      instructions: {
        googleConsole:
          "Go to Google Cloud Console → APIs & Services → Credentials",
        redirectUri: `Add this exact URI: ${baseUrl}/api/auth/callback/google`,
        authorizedDomains: "Add your domain to Authorized domains if needed",
        testEmail:
          "Try email/password login with loveserenespaces@gmail.com / Spaces123",
        localDevelopment:
          process.env.NODE_ENV === "development"
            ? "Using localhost:3000 for OAuth callbacks"
            : "Using production URL for OAuth callbacks",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get debug info",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

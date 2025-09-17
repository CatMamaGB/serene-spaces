import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "✅ Set" : "❌ Missing",
    };

    // Check if we're in development or production
    const environment = process.env.NODE_ENV || "development";
    
    // Expected redirect URIs
    const expectedRedirectUris = {
      development: "http://localhost:3000/api/auth/callback/google",
      production: "https://www.loveserenespaces.com/api/auth/callback/google",
    };

    return NextResponse.json({
      status: "Auth configuration check",
      environment,
      envCheck,
      expectedRedirectUris,
      currentUrl: req.url,
      recommendations: [
        "1. Ensure Google Cloud Console has the correct redirect URIs",
        "2. Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct",
        "3. Verify NEXTAUTH_URL matches your domain",
        "4. If getting 'invalid_grant', try revoking permissions at myaccount.google.com/permissions",
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check auth configuration", details: error },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      message: "API is working",
      timestamp: new Date().toISOString(),
      env: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
    });
  } catch {
    return NextResponse.json({ error: "API test failed" }, { status: 500 });
  }
}

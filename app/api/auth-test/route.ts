import { NextResponse } from "next/server";
import { handlers } from "@/lib/auth";

export async function GET() {
  try {
    // Test if NextAuth handlers are accessible
    console.log("Testing NextAuth handlers...");
    console.log("Handlers available:", !!handlers);

    // Test environment variables
    const envCheck = {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
      googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    };

    console.log("Environment check:", envCheck);

    return NextResponse.json({
      message: "NextAuth test route",
      handlersAvailable: !!handlers,
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("NextAuth test route error:", error);
    return NextResponse.json(
      {
        error: "NextAuth test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

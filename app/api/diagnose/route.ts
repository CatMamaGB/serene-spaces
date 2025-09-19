import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? "SET" : "NOT SET",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "NOT SET",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "SET" : "NOT SET",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
      },
      database: {
        connection: "UNKNOWN",
        error: null as string | null,
      },
      stripe: {
        configured: false,
        error: null as string | null,
      },
    };

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      diagnostics.database.connection = "✅ CONNECTED";
    } catch (dbError) {
      diagnostics.database.connection = "❌ FAILED";
      diagnostics.database.error =
        dbError instanceof Error ? dbError.message : "Unknown error";
    }

    // Test Stripe configuration
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        const { stripe } = await import("@/lib/stripe");
        if (stripe) {
          diagnostics.stripe.configured = true;
        }
      }
    } catch (stripeError) {
      diagnostics.stripe.error =
        stripeError instanceof Error ? stripeError.message : "Unknown error";
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Diagnostic failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

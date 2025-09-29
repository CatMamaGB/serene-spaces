import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check database for credentials
    const credentials = await (prisma as any).gmailCredential.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        hasToken: true,
        refreshToken: true, // Include actual token length info
      }
    });

    return NextResponse.json({
      success: true,
      database: {
        credentialCount: credentials.length,
        credentials: credentials.map(c => ({
          id: c.id,
          userId: c.userId,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
          hasToken: !!c.refreshToken,
          tokenLength: c.refreshToken?.length || 0,
          tokenPreview: c.refreshToken?.substring(0, 20) + "..." || "none"
        })),
        latestCredential: credentials[0] || null
      },
      environment: {
        hasMailingRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
        mailingRefreshTokenLength: process.env.GMAIL_REFRESH_TOKEN?.length || 0,
      },
      diagnostic: {
        message: "Visit /api/gmail/connect to authorize Gmail access",
        connectUrl: "/api/gmail/connect"
      }
    });
  } catch (error) {
    console.error("Gmail debug error:", error);
    return NextResponse.json(
      { 
        error: "Failed to debug Gmail setup", 
        detail: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

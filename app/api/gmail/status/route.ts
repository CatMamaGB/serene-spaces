import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the latest Gmail credentials
    const credentials = await (prisma as any).gmailCredential.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 1,
      select: {
        id: true,
        userId: true,
        hasRefreshToken: true,
        createdAt: true,
        updatedAt: true,
        refreshToken: true, // Include actual token for debugging
      }
    });

    return NextResponse.json({
      success: true,
      credentials,
      count: credentials.length,
      latestUpdate: credentials[0]?.updatedAt,
    });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { 
        error: "Failed to query database",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

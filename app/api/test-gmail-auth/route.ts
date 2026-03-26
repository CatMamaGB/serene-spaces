import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { diagnosticsNotAllowedResponse } from "@/lib/diagnostics-allowed";

export const runtime = "nodejs";

export async function GET() {
  const blocked = diagnosticsNotAllowedResponse();
  if (blocked) return blocked;

  try {
    // Check authentication
    const session = await auth();
    
    // Check for stored tokens
    const tokenInfo = {
      hasSession: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      hasTokenInDB: false,
      tokenId: null,
      tokenLength: 0,
    };

    if (session?.user?.id) {
      try {
        const credential = await (prisma as any).gmailCredential.findFirst({
          where: { userId: session.user.id }
        });
        
        tokenInfo.hasTokenInDB = !!credential?.refreshToken;
        tokenInfo.tokenId = credential?.id || null;
        tokenInfo.tokenLength = credential?.refreshToken?.length || 0;
      } catch (dbError) {
        logger.errorFrom("Test Gmail auth DB query", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      ...tokenInfo,
      message: tokenInfo.hasTokenInDB 
        ? "✅ Gmail token found in database" 
        : "❌ No Gmail token found - need to authorize",
    });
  } catch (error) {
    logger.errorFrom("GET /api/test-gmail-auth", error);
    return NextResponse.json(
      { error: "Test failed", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

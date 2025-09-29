import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    
    // Check for stored tokens
    let tokenInfo = {
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
        console.error("DB query failed:", dbError);
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
    console.error("Test Gmail auth error:", error);
    return NextResponse.json(
      { error: "Test failed", detail: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

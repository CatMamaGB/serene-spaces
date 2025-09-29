import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Delete all Gmail tokens from database
    const { prisma } = await import("@/lib/prisma");
    const result = await (prisma as any).gmailCredential.deleteMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      message: "Cleared all Gmail tokens for this user",
      deletedCount: result.count,
      userId: session.user.id
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to clear tokens",
      details: error.message
    }, { status: 500 });
  }
}

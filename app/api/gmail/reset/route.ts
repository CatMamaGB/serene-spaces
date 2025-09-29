import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Delete any existing Gmail credentials for this user
    await (prisma as any).gmailCredential.deleteMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json({
      success: true,
      message: "Gmail credentials cleared. Please re-authorize via /api/gmail/connect",
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Reset Gmail credentials error:", error);
    return NextResponse.json(
      { error: "Failed to reset credentials" },
      { status: 500 }
    );
  }
}

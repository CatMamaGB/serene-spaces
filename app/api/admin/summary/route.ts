import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [pendingServiceRequests, unreadContactInquiries] = await Promise.all([
      prisma.serviceRequest.count({ where: { status: "new" } }),
      prisma.contactInquiry.count({ where: { readAt: null } }),
    ]);

    return NextResponse.json({
      pendingServiceRequests,
      unreadContactInquiries,
    });
  } catch (e) {
    logger.errorFrom("GET /api/admin/summary", e);
    return NextResponse.json(
      { error: "Failed to load summary" },
      { status: 500 },
    );
  }
}

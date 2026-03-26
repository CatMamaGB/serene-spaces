import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const read = body?.read === true;

    if (!read) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await prisma.contactInquiry.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.errorFrom("PATCH /api/contact-inquiries/[id]", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

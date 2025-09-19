import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/pricing - Get all price lists and items
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const priceLists = await (prisma as any).priceList.findMany({
      include: {
        items: {
          orderBy: [{ category: "asc" }, { name: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ priceLists });
  } catch (error) {
    console.error("Error fetching price lists:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/pricing - Create new price list
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, status = "draft", effectiveAt } = body;

    // If publishing, ensure no other list is published
    if (status === "published") {
      await (prisma as any).priceList.updateMany({
        where: { status: "published" },
        data: { status: "draft" },
      });
    }

    const priceList = await (prisma as any).priceList.create({
      data: {
        name,
        status,
        effectiveAt: effectiveAt ? new Date(effectiveAt) : null,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ priceList });
  } catch (error) {
    console.error("Error creating price list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

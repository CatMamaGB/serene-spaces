import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/pricing/items - Get all price items
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const priceListId = searchParams.get("priceListId");
    const category = searchParams.get("category");

    const where: any = {};
    if (priceListId) where.priceListId = priceListId;
    if (category) where.category = category;

    const items = await (prisma as any).priceItem.findMany({
      where,
      include: {
        priceList: true,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching price items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/pricing/items - Create new price item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      priceListId,
      name,
      category,
      unitPrice,
      taxable = true,
      scope = "item",
      active = true,
    } = body;

    const item = await (prisma as any).priceItem.create({
      data: {
        priceListId,
        name,
        category,
        unitPrice: parseFloat(unitPrice),
        taxable,
        scope,
        active,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error creating price item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

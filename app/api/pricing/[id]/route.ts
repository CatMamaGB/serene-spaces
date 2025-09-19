import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/pricing/[id] - Get specific price list
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const priceList = await (prisma as any).priceList.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: [{ category: "asc" }, { name: "asc" }],
        },
      },
    });

    if (!priceList) {
      return NextResponse.json(
        { error: "Price list not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ priceList });
  } catch (error) {
    console.error("Error fetching price list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT /api/pricing/[id] - Update price list
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { name, status, effectiveAt } = body;

    // If publishing, ensure no other list is published
    if (status === "published") {
      await (prisma as any).priceList.updateMany({
        where: {
          status: "published",
          id: { not: id },
        },
        data: { status: "draft" },
      });
    }

    const priceList = await (prisma as any).priceList.update({
      where: { id },
      data: {
        name,
        status,
        effectiveAt: effectiveAt ? new Date(effectiveAt) : null,
        publishedAt: status === "published" ? new Date() : undefined,
      },
    });

    return NextResponse.json({ priceList });
  } catch (error) {
    console.error("Error updating price list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/pricing/[id] - Delete price list
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if this is the only published list
    const publishedLists = await (prisma as any).priceList.count({
      where: { status: "published" },
    });

    const currentList = await (prisma as any).priceList.findUnique({
      where: { id },
    });

    if (currentList?.status === "published" && publishedLists === 1) {
      return NextResponse.json(
        {
          error: "Cannot delete the only published price list",
        },
        { status: 400 },
      );
    }

    await (prisma as any).priceList.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting price list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

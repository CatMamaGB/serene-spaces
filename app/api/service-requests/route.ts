import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const select = searchParams.get("select");

    // Handle count queries
    if (select === "count") {
      const whereClause = status ? { status } : {};
      const count = await prisma.serviceRequest.count({
        where: whereClause,
      });
      return NextResponse.json({ count });
    }

    // Handle status filtering
    const whereClause = status ? { status } : {};

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(serviceRequests);
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json([]);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, scheduledPickupDate, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing service request ID" },
        { status: 400 },
      );
    }

    const updatedRequest = await (prisma as any).serviceRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        scheduledPickupDate: scheduledPickupDate
          ? new Date(scheduledPickupDate)
          : undefined,
        internalNotes: notes || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json(
      { error: "Failed to update service request" },
      { status: 500 },
    );
  }
}

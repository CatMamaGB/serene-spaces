import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
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
    const body = await req.json();
    const {
      id,
      status,
      estimatedCost,
      actualCost,
      scheduledPickupDate,
      notes,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing service request ID" },
        { status: 400 },
      );
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status: status || undefined,
        estimatedCost: estimatedCost || undefined,
        actualCost: actualCost || undefined,
        scheduledPickupDate: scheduledPickupDate
          ? new Date(scheduledPickupDate)
          : undefined,
        notes: notes || undefined,
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

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

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
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

    const whereClause = status ? { status } : {};

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(
      500,
      Math.max(1, parseInt(searchParams.get("pageSize") || "100", 10) || 100),
    );
    const skip = (page - 1) * pageSize;

    const [serviceRequests, total] = await Promise.all([
      prisma.serviceRequest.findMany({
        where: whereClause,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.serviceRequest.count({ where: whereClause }),
    ]);

    // Transform the data to match the frontend interface
    const transformedRequests = serviceRequests.map((request) => {
      // Parse services from internalNotes
      let services: string[] = [];
      let repairNotes = "";
      let waterproofingNotes = "";
      let allergies = "";

      if ((request as any).internalNotes) {
        const lines = (request as any).internalNotes.split("\n");
        for (const line of lines) {
          if (line.startsWith("Services: ")) {
            const servicesStr = line.replace("Services: ", "");
            services = servicesStr
              ? servicesStr.split(", ").filter((s: string) => s.trim())
              : [];
          } else if (line.startsWith("Repair Notes: ")) {
            repairNotes = line.replace("Repair Notes: ", "");
          } else if (line.startsWith("Waterproofing Notes: ")) {
            waterproofingNotes = line.replace("Waterproofing Notes: ", "");
          } else if (line.startsWith("Allergies: ")) {
            allergies = line.replace("Allergies: ", "");
          }
        }
      }

      return {
        id: request.id,
        customerId: request.customerId,
        customer: request.customer,
        services,
        address: request.customer.address || "",
        status: request.status,
        createdAt: request.createdAt.toISOString(),
        pickupDate: request.pickupDate?.toISOString(),
        scheduledPickupDate: request.scheduledPickupDate?.toISOString(),
        repairNotes: repairNotes === "None" ? "" : repairNotes,
        waterproofingNotes:
          waterproofingNotes === "None" ? "" : waterproofingNotes,
        allergies: allergies === "None" ? "" : allergies,
        notes: (request as any).internalNotes,
      };
    });

    return NextResponse.json({
      serviceRequests: transformedRequests,
      total,
      page,
      pageSize,
      hasMore: skip + transformedRequests.length < total,
    });
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
      { status: 500 },
    );
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

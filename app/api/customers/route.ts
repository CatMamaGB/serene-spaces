import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const pageSize = Math.min(
      500,
      Math.max(1, parseInt(searchParams.get("pageSize") || "100", 10) || 100),
    );
    const skip = (page - 1) * pageSize;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.customer.count(),
    ]);

    return NextResponse.json({
      customers,
      total,
      page,
      pageSize,
      hasMore: skip + customers.length < total,
    });
  } catch (error) {
    logger.errorFrom("GET /api/customers", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      logger.error("POST /api/customers: DATABASE_URL not set");
      return NextResponse.json(
        {
          error: "Database not configured",
          details: "DATABASE_URL environment variable is missing",
        },
        { status: 500 },
      );
    }

    const body = await req.json();
    logger.debug("Creating customer", { name: body?.name, hasEmail: !!body?.email });

    const {
      name,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 },
      );
    }

    logger.debug("Creating customer in database");
    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
      },
    });

    logger.debug("Customer created", { id: customer.id });
    return NextResponse.json(customer);
  } catch (error) {
    logger.errorFrom("POST /api/customers", error);

    // Provide more detailed error information
    let errorMessage = "Failed to create customer";
    let errorDetails = "Unknown error";

    if (error instanceof Error) {
      errorDetails = error.message;
      if (error.message.includes("Unique constraint")) {
        errorMessage = "Customer with this email already exists";
      } else if (error.message.includes("connection")) {
        errorMessage = "Database connection failed";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

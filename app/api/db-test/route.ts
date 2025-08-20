import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as test`;

    // Test if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    // Test customer count
    const customerCount = await prisma.customer.count();

    // Test service request count
    const serviceRequestCount = await prisma.serviceRequest.count();

    // Test invoice count
    const invoiceCount = await prisma.invoiceMirror.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      timestamp: new Date().toISOString(),
      database: {
        connection: "✅ Connected",
        tables: tables,
        counts: {
          customers: customerCount,
          serviceRequests: serviceRequestCount,
          invoices: invoiceCount,
        },
      },
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

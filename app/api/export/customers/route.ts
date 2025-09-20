import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert to CSV format
    const csvHeaders = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "Postal Code",
      "Country",
      "Created At",
      "Updated At",
    ];

    const csvRows = customers.map((customer) => [
      customer.id,
      customer.name || "",
      customer.email || "",
      customer.phone || "",
      customer.address || "",
      customer.addressLine1 || "",
      customer.addressLine2 || "",
      customer.city || "",
      customer.state || "",
      customer.postalCode || "",
      customer.country || "",
      customer.createdAt.toISOString(),
      customer.updatedAt.toISOString(),
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting customers:", error);
    return NextResponse.json(
      { error: "Failed to export customers" },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const yearFilter = searchParams.get("year");
    const monthFilter = searchParams.get("month");
    const customerFilter = searchParams.get("customer");

    // Build where clause based on filters
    const whereClause: any = {};

    if (statusFilter && statusFilter !== "all") {
      if (statusFilter.includes(",")) {
        // Handle multiple statuses (e.g., "open,draft")
        whereClause.status = { in: statusFilter.split(",") };
      } else {
        whereClause.status = statusFilter;
      }
    }

    if (yearFilter && yearFilter !== "all") {
      const year = parseInt(yearFilter);
      whereClause.issueDate = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }

    if (
      monthFilter &&
      monthFilter !== "all" &&
      yearFilter &&
      yearFilter !== "all"
    ) {
      const year = parseInt(yearFilter);
      const month = parseInt(monthFilter) - 1; // JavaScript months are 0-indexed
      whereClause.issueDate = {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      };
    }

    // First get invoices without complex includes
    const invoices = await (prisma as any).invoice.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // Get customers separately to avoid complex joins
    const customerIds = [
      ...new Set(invoices.map((inv: any) => inv.customerId)),
    ] as string[];
    const customers = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, name: true, email: true, phone: true },
    });

    const customerMap = new Map(customers.map((c) => [c.id, c]));

    // Convert to CSV format
    const csvHeaders = [
      "Invoice ID",
      "Invoice Number",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Status",
      "Issue Date",
      "Due Date",
      "Subtotal",
      "Tax",
      "Total",
      "Balance",
      "Apply Tax",
      "Tax Rate",
      "Notes",
      "Created At",
      "Updated At",
    ];

    // Filter by customer name if specified
    let filteredInvoices = invoices;
    if (customerFilter) {
      filteredInvoices = invoices.filter((invoice: any) => {
        const customer = customerMap.get(invoice.customerId);
        return customer?.name
          ?.toLowerCase()
          .includes(customerFilter.toLowerCase());
      });
    }

    const csvRows = filteredInvoices.map((invoice: any) => {
      const customer = customerMap.get(invoice.customerId);
      return [
        invoice.id,
        invoice.number || "",
        customer?.name || "",
        customer?.email || "",
        customer?.phone || "",
        invoice.status || "",
        invoice.issueDate
          ? new Date(invoice.issueDate).toISOString().split("T")[0]
          : "",
        invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split("T")[0]
          : "",
        invoice.subtotal?.toString() || "0",
        invoice.tax?.toString() || "0",
        invoice.total?.toString() || "0",
        invoice.balance?.toString() || "0",
        invoice.applyTax ? "Yes" : "No",
        invoice.taxRate?.toString() || "0",
        invoice.notes || "",
        invoice.createdAt.toISOString(),
        invoice.updatedAt.toISOString(),
      ];
    });

    // Escape CSV values
    const escapeCsvValue = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row: any) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="invoices-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting invoices:", error);
    return NextResponse.json(
      { error: "Failed to export invoices" },
      { status: 500 },
    );
  }
}

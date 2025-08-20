import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoices = await prisma.invoiceMirror.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitAmount: true,
          },
        },
      },
    });

    // Format the data for the frontend
    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      customerId: invoice.customerId,
      customer: invoice.customer,
      customerName: invoice.customer.name,
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate?.toISOString(),
      dueDate: invoice.dueDate?.toISOString(),
      total: invoice.total,
      status: invoice.status,
      hostedUrl: invoice.hostedUrl,
      pdfUrl: invoice.pdfUrl,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      notes: invoice.notes,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      items: invoice.items,
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}

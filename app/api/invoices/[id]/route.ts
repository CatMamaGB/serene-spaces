import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("GET request received for invoice ID:", id);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not set");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    // Fetch the invoice with customer and items
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Transform the data to match the frontend interface
    const transformedInvoice = {
      id: invoice.id,
      customerName: invoice.customer?.name || "Unknown Customer",
      customerEmail: invoice.customer?.email || "",
      customerPhone: invoice.customer?.phone || "",
      customerAddress:
        [
          invoice.customer?.addressLine1,
          invoice.customer?.addressLine2,
          invoice.customer?.city,
          invoice.customer?.state,
          invoice.customer?.postalCode,
        ]
          .filter(Boolean)
          .join(", ") || "",
      invoiceDate:
        invoice.issueDate?.toISOString().split("T")[0] ||
        invoice.createdAt.toISOString().split("T")[0],
      dueDate: invoice.dueDate?.toISOString().split("T")[0] || "",
      status: invoice.status,
      items: invoice.items.map(
        (item: {
          description: string;
          quantity: number;
          unitAmount: number;
        }) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.unitAmount / 100, // Convert cents to dollars
          amount: (item.unitAmount * item.quantity) / 100, // Convert cents to dollars
        }),
      ),
      notes: invoice.notes || "",
      terms: "Payment due before delivery",
      subtotal: invoice.subtotal / 100, // Convert cents to dollars
      tax: invoice.tax / 100, // Convert cents to dollars
      total: invoice.total / 100, // Convert cents to dollars
    };

    return NextResponse.json(transformedInvoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("DELETE request received for invoice ID:", id);

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL not set");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    // First, check if the invoice exists
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
      include: { items: true },
    });

    console.log("Invoice found:", invoice ? "Yes" : "No");

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Delete the invoice and all related items (cascade will handle this)
    await prisma.invoiceMirror.delete({
      where: { id },
    });

    console.log("Invoice deleted successfully");
    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // Check if the invoice exists
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update the invoice status
    const updatedInvoice = await prisma.invoiceMirror.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      {
        message: "Invoice status updated successfully",
        invoice: updatedInvoice,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 },
    );
  }
}

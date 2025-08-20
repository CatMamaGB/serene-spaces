import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
      include: {
        customer: {
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
          },
        },
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitAmount: true,
            taxable: true,
            notes: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Format the data for the frontend
    const formattedInvoice = {
      id: invoice.id,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      customerPhone: invoice.customer.phone,
      customerAddress:
        [
          invoice.customer.addressLine1,
          invoice.customer.addressLine2,
          invoice.customer.city,
          invoice.customer.state,
          invoice.customer.postalCode,
        ]
          .filter(Boolean)
          .join(", ") || invoice.customer.address,
      invoiceDate:
        invoice.issueDate?.toISOString() || invoice.createdAt.toISOString(),
      dueDate: invoice.dueDate?.toISOString(),
      status: invoice.status,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.unitAmount / 100, // Convert from cents
        amount: (item.unitAmount * item.quantity) / 100, // Convert from cents
      })),
      notes: invoice.notes || "",
      terms: "Payment due before delivery",
      subtotal: invoice.subtotal / 100, // Convert from cents
      tax: invoice.tax / 100, // Convert from cents
      total: invoice.total / 100, // Convert from cents
      invoiceNumber: invoice.invoiceNumber,
    };

    return NextResponse.json(formattedInvoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
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

    // Handle status-only updates (for status changes)
    if (body.status && Object.keys(body).length === 1) {
      const updatedInvoice = await prisma.invoiceMirror.update({
        where: { id },
        data: { status: body.status },
        include: {
          customer: true,
          items: true,
        },
      });
      return NextResponse.json(updatedInvoice);
    }

    // Handle full invoice updates
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      items,
      notes,
      subtotal,
      tax,
      total,
      status,
    } = body;

    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Customer name and items are required" },
        { status: 400 },
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: customerEmail }, { name: customerName }],
      },
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail || null,
          phone: customerPhone || null,
          address: customerAddress || null,
          addressLine1: customerAddress?.split(",")[0]?.trim() || null,
          city:
            customerAddress
              ?.split(",")
              .find((part: string) => part.trim().match(/^[A-Za-z\s]+$/))
              ?.trim() || null,
          state:
            customerAddress
              ?.split(",")
              .find((part: string) => part.trim().match(/^[A-Z]{2}$/))
              ?.trim() || null,
          postalCode:
            customerAddress
              ?.split(",")
              .find((part: string) => part.trim().match(/^\d{5}(-\d{4})?$/))
              ?.trim() || null,
        },
      });
    }

    // Update invoice items first (delete existing and create new)
    await prisma.invoiceItemMirror.deleteMany({
      where: { invoiceId: id },
    });

    // Update the invoice
    const updatedInvoice = await prisma.invoiceMirror.update({
      where: { id },
      data: {
        customerId: customer.id,
        status: status || "draft",
        subtotal: Math.round(subtotal * 100), // Convert to cents
        tax: Math.round(tax * 100), // Convert to cents
        total: Math.round(total * 100), // Convert to cents
        issueDate: invoiceDate ? new Date(invoiceDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || null,
        items: {
          create: items.map(
            (item: {
              description: string;
              quantity: number;
              rate: number;
              amount: number;
            }) => ({
              description: item.description,
              quantity: item.quantity,
              unitAmount: Math.round(item.rate * 100), // Convert to cents
              taxable: true,
              notes: null,
            }),
          ),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
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
    // Delete invoice items first (due to foreign key constraints)
    await prisma.invoiceItemMirror.deleteMany({
      where: { invoiceId: id },
    });

    // Delete the invoice
    await prisma.invoiceMirror.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

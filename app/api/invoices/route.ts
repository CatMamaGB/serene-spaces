import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Creating invoice with data:", JSON.stringify(body, null, 2));

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
      status = "draft",
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
          // Parse address components if available
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

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create invoice in database
    const invoice = await prisma.invoiceMirror.create({
      data: {
        customerId: customer.id,
        stripeInvoiceId: `local-${Date.now()}`, // Placeholder for local invoices
        status: status,
        subtotal: Math.round(subtotal * 100), // Convert to cents
        tax: Math.round(tax * 100), // Convert to cents
        total: Math.round(total * 100), // Convert to cents
        invoiceNumber: invoiceNumber,
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

    console.log("Invoice created successfully:", invoice.id);

    return NextResponse.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      total: invoice.total,
      message: "Invoice created successfully",
    });
  } catch (err: unknown) {
    console.error("Error creating invoice:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

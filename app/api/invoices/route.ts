import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { nextInvoiceNumber } from "@/lib/invoice-number";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Creating invoice with data:", JSON.stringify(body, null, 2));

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      items,
      notes,
      terms,
      subtotal,
      tax,
      total,
      applyTax = true,
      taxRate = 6.25,
      status = "open",
    } = body;

    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Customer name and items are required" },
        { status: 400 },
      );
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Find or create customer
      let customer = await tx.customer.findFirst({
        where: {
          OR: [{ email: customerEmail }, { name: customerName }],
        },
      });

      if (!customer) {
        // Create new customer
        customer = await tx.customer.create({
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

      // Generate sequential invoice number
      const number = await nextInvoiceNumber(tx);

      // Create invoice in database
      const invoice = await (tx as any).invoice.create({
        data: {
          customerId: customer.id,
          number,
          status: status,
          issueDate: invoiceDate ? new Date(invoiceDate) : new Date(),
          subtotal: subtotal,
          tax: tax,
          total: total,
          balance: total,
          applyTax: applyTax,
          taxRate: taxRate,
          notes: notes || null,
          internalMemo: terms || null,
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
                unitPrice: item.rate,
                taxable: true,
                lineTotal: item.amount,
              }),
            ),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      return invoice;
    });

    console.log("Invoice created successfully:", result.id);

    return NextResponse.json({
      id: result.id,
      number: result.number,
      status: result.status,
      total: result.total,
      message: "Invoice created successfully",
    });
  } catch (err: unknown) {
    console.error("Error creating invoice:", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

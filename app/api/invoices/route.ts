import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { nextInvoiceNumber } from "@/lib/invoice-number";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { calcTotals } from "@/lib/invoice-totals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type NormalizedInvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    logger.debug("Creating invoice", {
      customerName: body?.customerName,
      itemCount: Array.isArray(body?.items) ? body.items.length : 0,
    });

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      items,
      notes,
      terms,
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

    const normalizedItems: NormalizedInvoiceItem[] = items.map(
      (item: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
      }) => ({
        description: String(item.description || "").trim(),
        quantity: Math.max(1, Number(item.quantity) || 1),
        rate: Number(item.rate) || 0,
      }),
    );

    const decimalTaxRate = new Prisma.Decimal(Number(taxRate) || 0);
    const totals = calcTotals(
      normalizedItems.map((item: NormalizedInvoiceItem) => ({
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.rate),
        taxable: true,
      })),
      decimalTaxRate,
      Boolean(applyTax),
    );

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Find or create customer
      let customer = await tx.customer.findFirst({
        where: {
          deletedAt: null,
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
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
          balance: totals.total,
          applyTax: Boolean(applyTax),
          taxRate: decimalTaxRate,
          notes: notes || null,
          internalMemo: terms || null,
          items: {
            create: normalizedItems.map((item: NormalizedInvoiceItem) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.rate,
                taxable: true,
                lineTotal: new Prisma.Decimal(item.quantity).times(
                  new Prisma.Decimal(item.rate),
                ),
              })),
          },
        },
        include: {
          customer: true,
          items: true,
        },
      });

      return invoice;
    });

    logger.debug("Invoice created", { id: result.id });

    return NextResponse.json({
      id: result.id,
      number: result.number,
      status: result.status,
      total: result.total,
      message: "Invoice created successfully",
    });
  } catch (err: unknown) {
    logger.errorFrom("POST /api/invoices", err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

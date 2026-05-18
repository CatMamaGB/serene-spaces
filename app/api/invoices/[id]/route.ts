import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/api-auth";
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
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
            unitPrice: true,
            taxable: true,
            lineTotal: true,
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
        invoice.issueDate?.toISOString().split("T")[0] ||
        invoice.createdAt.toISOString().split("T")[0],
      dueDate: invoice.dueDate?.toISOString().split("T")[0],
      status: invoice.status,
      items: invoice.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: Number(item.unitPrice),
        amount: Number(item.lineTotal),
      })),
      notes: invoice.notes || "",
      terms: invoice.internalMemo || "",
      subtotal: Number(invoice.subtotal),
      tax: Number(invoice.tax),
      total: Number(invoice.total),
      applyTax: invoice.applyTax,
      taxRate: Number(invoice.taxRate),
      invoiceNumber: invoice.number,
    };

    return NextResponse.json(formattedInvoice);
  } catch (error) {
    logger.errorFrom("GET /api/invoices/[id]", error);
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Handle status-only updates (for status changes)
    if (body.status && Object.keys(body).length === 1) {
      const updatedInvoice = await prisma.invoice.update({
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
      items,
      notes,
      terms,
      applyTax,
      taxRate,
      status,
    } = body;

    // Validate required fields
    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Customer name and items are required" },
        { status: 400 },
      );
    }

    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const nextApplyTax =
      typeof applyTax === "boolean" ? applyTax : existing.applyTax;
    const nextTaxRate = new Prisma.Decimal(
      taxRate ?? existing.taxRate.toString(),
    );
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
    const totals = calcTotals(
      normalizedItems.map((item: NormalizedInvoiceItem) => ({
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(item.rate),
        taxable: true,
      })),
      nextTaxRate,
      nextApplyTax,
    );

    // Keep invoice linked to the same customer; update that customer's fields in place.
    await prisma.customer.update({
      where: { id: existing.customerId },
      data: {
        name: customerName.trim(),
        email: customerEmail?.trim() || null,
        phone: customerPhone?.trim() || null,
        address: customerAddress?.trim() || null,
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

    // Update invoice items first (delete existing and create new)
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    // Update the invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        customerId: existing.customerId,
        status: status || "draft",
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        balance: totals.total,
        applyTax: nextApplyTax,
        taxRate: nextTaxRate,
        issueDate: invoiceDate ? new Date(invoiceDate) : new Date(),
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

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    logger.errorFrom("PATCH /api/invoices/[id]", error);
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
    const denied = await requireAdmin();
    if (denied.response) return denied.response;

    const { id } = await params;
    await prisma.payment.deleteMany({
      where: { invoiceId: id },
    });
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id },
    });

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    logger.errorFrom("DELETE /api/invoices/[id]", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

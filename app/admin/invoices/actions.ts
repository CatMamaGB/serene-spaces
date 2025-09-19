// app/admin/invoices/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { nextInvoiceNumber } from "@/lib/invoice-number";

export interface CreateInvoiceData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  invoiceDate: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
  terms?: string;
  subtotal: number;
  tax: number;
  total: number;
  status?: string;
}

export async function createInvoice(data: CreateInvoiceData) {
  return await prisma.$transaction(async (tx) => {
    const number = await nextInvoiceNumber(tx);

    const invoice = await tx.invoice.create({
      data: {
        number,
        customerId: "temp-customer-id", // We'll need to handle customer creation separately
        status: data.status || "draft",
        issueDate: new Date(data.invoiceDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        balance: data.total,
        notes: data.notes,
        internalMemo: data.terms,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.rate,
            taxable: true,
            lineTotal: item.amount,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return invoice;
  });
}

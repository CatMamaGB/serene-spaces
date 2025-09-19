"use server";
import { prisma } from "@/lib/prisma";
import { calcTotals } from "@/lib/invoice-totals";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function recompute(invoiceId: string) {
  const inv = await (prisma as any).invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true },
  });
  if (!inv) return;

  const totals = calcTotals(
    inv.items.map((i: any) => ({
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      taxable: i.taxable,
    })),
    inv.taxRate,
    inv.applyTax,
  );

  await (prisma as any).invoice.update({
    where: { id: invoiceId },
    data: {
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    },
  });
}

export async function toggleItemTaxable(itemId: string, taxable: boolean) {
  const item = await (prisma as any).invoiceItem.update({
    where: { id: itemId },
    data: { taxable },
    select: { invoiceId: true },
  });
  await recompute(item.invoiceId);
  revalidatePath(`/admin/invoices/${item.invoiceId}`);
}

export async function setInvoiceApplyTax(invoiceId: string, apply: boolean) {
  await (prisma as any).invoice.update({
    where: { id: invoiceId },
    data: { applyTax: apply },
  });
  await recompute(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
}

export async function setInvoiceTaxRate(
  invoiceId: string,
  ratePercent: number,
) {
  await (prisma as any).invoice.update({
    where: { id: invoiceId },
    data: { taxRate: new Prisma.Decimal(ratePercent) },
  });
  await recompute(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
}

export async function refreshDraftFromPublished(invoiceId: string) {
  const inv = await (prisma as any).invoice.findUnique({
    where: { id: invoiceId },
  });
  if (!inv || inv.status !== "draft") return;

  const list = await (prisma as any).priceList.findFirst({
    where: { status: "PUBLISHED" },
    include: { items: true },
  });
  if (!list) return;

  // Create a map of price item IDs to price items
  const map = new Map(list.items.map((i: any) => [i.id, i]));

  const items = await (prisma as any).invoiceItem.findMany({
    where: { invoiceId },
  });
  for (const it of items) {
    // Skip if no priceItemId or if the price item doesn't exist in the published list
    if (!it.priceItemId) continue;
    const pi = map.get(it.priceItemId) as any;
    if (!pi) continue;

    // Update the invoice item with the new price and taxable status
    await (prisma as any).invoiceItem.update({
      where: { id: it.id },
      data: {
        unitPrice: pi.unitPrice,
        taxable: pi.taxable,
      },
    });
  }
  await recompute(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
}

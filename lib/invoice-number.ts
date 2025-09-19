// lib/invoice-number.ts
import type { Prisma, PrismaClient } from "@prisma/client";

const pad = (n: number, width = 4) => n.toString().padStart(width, "0");

export async function nextInvoiceNumber(
  tx: Prisma.TransactionClient | PrismaClient,
) {
  const year = new Date().getFullYear();
  const seq = await (tx as any).invoiceSequence.upsert({
    where: { year },
    update: { value: { increment: 1 } },
    create: { year, value: 1 },
  });
  const n = seq.value; // 1, 2, 3...
  return `SS-${year}-${pad(n, 4)}`;
}

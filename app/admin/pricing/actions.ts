"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createDraftFromPublished() {
  const pub = await prisma.priceList.findFirst({
    where: { status: "PUBLISHED" },
    include: { items: true },
  });

  if (!pub) {
    await prisma.priceList.create({
      data: {
        name: "Draft",
        status: "DRAFT",
      },
    });
    revalidatePath("/admin/pricing");
    return;
  }

  await prisma.priceList.create({
    data: {
      name: `${pub.name} (Draft)`,
      status: "DRAFT",
      items: {
        create: pub.items.map((i) => ({
          name: i.name,
          category: i.category,
          scope: i.scope,
          unitPrice: i.unitPrice,
          taxable: i.taxable,
          active: i.active,
          sortOrder: i.sortOrder,
        })),
      },
    },
  });
  revalidatePath("/admin/pricing");
}

export async function addItem(
  listId: string,
  input: {
    name: string;
    category: "WASHING" | "ADD_ON" | "REPAIR";
    unitPrice: number;
    taxable: boolean;
    scope?: "ITEM" | "ORDER";
  },
) {
  await prisma.priceItem.create({
    data: {
      priceListId: listId,
      name: input.name,
      category: input.category,
      scope: input.scope ?? "ITEM",
      unitPrice: new Prisma.Decimal(input.unitPrice),
      taxable: input.taxable,
      active: true,
    },
  });
  revalidatePath("/admin/pricing");
}

export async function updateItem(
  id: string,
  fields: {
    name?: string;
    unitPrice?: number;
    taxable?: boolean;
    sortOrder?: number;
  },
) {
  await prisma.priceItem.update({
    where: { id },
    data: {
      ...(fields.name && { name: fields.name }),
      ...(fields.unitPrice !== undefined && {
        unitPrice: new Prisma.Decimal(fields.unitPrice),
      }),
      ...(fields.taxable !== undefined && { taxable: fields.taxable }),
      ...(fields.sortOrder !== undefined && { sortOrder: fields.sortOrder }),
    },
  });
  revalidatePath("/admin/pricing");
}

// Prefer archive over hard delete to preserve history
export async function archiveItem(id: string) {
  await prisma.priceItem.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/pricing");
}

export async function publishDraft(listId: string) {
  const existing = await prisma.priceList.findFirst({
    where: { status: "PUBLISHED" },
  });
  if (existing) {
    await prisma.priceList.update({
      where: { id: existing.id },
      data: { status: "ARCHIVED" },
    });
  }
  await prisma.priceList.update({
    where: { id: listId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  revalidatePath("/admin/pricing");
}

export async function updatePriceList(
  listId: string,
  data: {
    name?: string;
    status?: string;
  },
) {
  await prisma.priceList.update({
    where: { id: listId },
    data,
  });
  revalidatePath("/admin/pricing");
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await prisma.invoiceMirror.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(list);
}

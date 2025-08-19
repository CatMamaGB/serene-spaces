import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // First, check if the invoice exists
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Delete the invoice and all related items (cascade will handle this)
    await prisma.invoiceMirror.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
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
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // Check if the invoice exists
    const invoice = await prisma.invoiceMirror.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update the invoice status
    const updatedInvoice = await prisma.invoiceMirror.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      {
        message: "Invoice status updated successfully",
        invoice: updatedInvoice,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 },
    );
  }
}

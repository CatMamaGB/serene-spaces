import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      phone,
      address,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
    } = body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 },
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        addressLine1: addressLine1?.trim() || null,
        addressLine2: addressLine2?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        postalCode: postalCode?.trim() || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAdmin();
    if (denied.response) return denied.response;

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const [mirrorInvoices, internalInvoices, serviceRequests, jobs] =
      await Promise.all([
        prisma.invoiceMirror.findMany({
          where: { customerId: id },
          take: 1,
        }),
        prisma.invoice.findMany({
          where: { customerId: id },
          take: 1,
        }),
        prisma.serviceRequest.findMany({
          where: { customerId: id },
          take: 1,
        }),
        prisma.job.findMany({
          where: { customerId: id },
          take: 1,
        }),
      ]);

    if (
      mirrorInvoices.length > 0 ||
      internalInvoices.length > 0 ||
      serviceRequests.length > 0 ||
      jobs.length > 0
    ) {
      const parts: string[] = [];
      if (mirrorInvoices.length > 0) parts.push("Stripe-linked invoices");
      if (internalInvoices.length > 0) parts.push("invoices");
      if (serviceRequests.length > 0) parts.push("service requests");
      if (jobs.length > 0) parts.push("jobs");

      return NextResponse.json(
        {
          error: `Cannot delete customer with associated ${parts.join(", ")}. Remove or reassign those records first.`,
        },
        { status: 400 },
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}

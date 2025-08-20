import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create a test customer
    const customer = await prisma.customer.create({
      data: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "(555) 123-4567",
        address: "123 Test Street, Test City, TS 12345",
        addressLine1: "123 Test Street",
        city: "Test City",
        state: "TS",
        postalCode: "12345",
      },
    });

    // Create a test service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: customer.id,
        services: ["Blanket Cleaning", "Waterproofing"],
        address: "123 Test Street, Test City, TS 12345",
        status: "pending",
        notes: "Test service request",
      },
    });

    // Create a test invoice
    const invoice = await prisma.invoiceMirror.create({
      data: {
        customerId: customer.id,
        stripeInvoiceId: `test-${Date.now()}`,
        status: "draft",
        subtotal: 5000, // $50.00 in cents
        tax: 312, // $3.12 in cents (6.25%)
        total: 5312, // $53.12 in cents
        invoiceNumber: `TEST-${Date.now()}`,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        notes: "Test invoice",
        items: {
          create: [
            {
              description: "Blanket Cleaning",
              quantity: 1,
              unitAmount: 2500, // $25.00 in cents
              taxable: true,
            },
            {
              description: "Waterproofing",
              quantity: 1,
              unitAmount: 2500, // $25.00 in cents
              taxable: true,
            },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test data created successfully",
      data: {
        customer: customer,
        serviceRequest: serviceRequest,
        invoice: invoice,
      },
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    // Clean up test data
    await prisma.invoiceItemMirror.deleteMany({
      where: {
        invoice: {
          stripeInvoiceId: {
            startsWith: "test-",
          },
        },
      },
    });

    await prisma.invoiceMirror.deleteMany({
      where: {
        stripeInvoiceId: {
          startsWith: "test-",
        },
      },
    });

    await prisma.serviceRequest.deleteMany({
      where: {
        notes: "Test service request",
      },
    });

    await prisma.customer.deleteMany({
      where: {
        email: "test@example.com",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test data cleaned up successfully",
    });
  } catch (error) {
    console.error("Error cleaning up test data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to clean up test data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }

    const list = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error("Error fetching customers:", error);
    // Return empty array instead of error to prevent JSON parsing issues
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;
    if (!name)
      return NextResponse.json({ error: "Missing name" }, { status: 400 });

    let stripeId = null;

    // create Stripe customer only if Stripe is configured
    if (stripe) {
      try {
        const sc = await stripe.customers.create({
          name,
          email: email || undefined,
          phone: phone || undefined,
        });
        stripeId = sc.id;
      } catch (stripeError) {
        console.warn("Failed to create Stripe customer:", stripeError);
        // Continue without Stripe customer
      }
    }

    const customer = await prisma.customer.create({
      data: { name, email, phone, stripeId },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}

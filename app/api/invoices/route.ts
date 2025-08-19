import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      customerId, 
      items, 
      invoiceNumber, 
      issueDate, 
      dueDate, 
      notes 
    } = body as { 
      customerId: string; 
      items: { description: string; quantity: number; unitAmount: number; taxable: boolean; notes?: string }[];
      invoiceNumber?: string;
      issueDate?: string;
      dueDate?: string;
      notes?: string;
    };

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    // ensure Stripe customer exists
    let stripeCustomerId = customer.stripeId;
    if (!stripeCustomerId) {
      const sc = await stripe.customers.create({ name: customer.name, email: customer.email || undefined, phone: customer.phone || undefined });
      stripeCustomerId = sc.id;
      await prisma.customer.update({ where: { id: customer.id }, data: { stripeId: sc.id } });
    }

    // create invoice items
    for (const it of items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await stripe.invoiceItems.create({
        customer: stripeCustomerId!,
        description: it.description,
        quantity: it.quantity,
        unit_amount: it.unitAmount,
        currency: "usd",
        tax_rates: it.taxable && process.env.STRIPE_TAX_RATE_ID ? [process.env.STRIPE_TAX_RATE_ID] : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }

    // create and finalize invoice
    const invoiceData = {
      customer: stripeCustomerId!,
      collection_method: "send_invoice" as const,
      days_until_due: 7,
      footer: "Thank you for your business."
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (invoiceNumber) (invoiceData as any).number = invoiceNumber;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (notes) (invoiceData as any).description = notes;
    if (issueDate && dueDate) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (invoiceData as any).metadata = { 
        issueDate, 
        dueDate: dueDate || '' 
      };
    }

    const inv = await stripe.invoices.create(invoiceData);

    if (!inv.id) throw new Error("Failed to create invoice");
    
    const finalized = await stripe.invoices.finalizeInvoice(inv.id);
    if (!finalized.id) throw new Error("Failed to finalize invoice");
    
    await stripe.invoices.sendInvoice(finalized.id);

    // mirror in DB
    const mirror = await prisma.invoiceMirror.create({
      data: {
        customerId: customer.id,
        stripeInvoiceId: finalized.id,
        status: finalized.status || "open",
        subtotal: finalized.subtotal || 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tax: (finalized as any).tax || 0,
        total: finalized.total || 0,
        hostedUrl: finalized.hosted_invoice_url || undefined,
        pdfUrl: finalized.invoice_pdf || undefined,
        // invoiceNumber: invoiceNumber || undefined, // Property not available in schema
        // issueDate: issueDate || undefined, // Property not available in schema
        // dueDate: dueDate || undefined, // Property not available in schema
        // notes: notes || undefined, // Property not available in schema
        items: {
          create: items.map(it => ({ 
            description: it.description, 
            quantity: it.quantity, 
            unitAmount: it.unitAmount, 
            taxable: it.taxable,
            notes: it.notes || undefined
          }))
        }
      }
    });

    return NextResponse.json({ id: mirror.id, hostedUrl: finalized.hosted_invoice_url, pdfUrl: finalized.invoice_pdf });
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

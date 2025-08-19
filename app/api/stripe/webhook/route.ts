import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // If Stripe is not configured, return early
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const buf = Buffer.from(await req.arrayBuffer());
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.eventLog.create({ data: { type: event.type, payload: event as any } });

  try {
    if (event.type === "invoice.finalized" || event.type === "invoice.sent" || event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inv = event.data.object as any;
      await prisma.invoiceMirror.update({
        where: { stripeInvoiceId: inv.id },
        data: {
          status: inv.status || undefined,
          subtotal: inv.subtotal ?? undefined,
          tax: inv.tax ?? undefined,
          total: inv.total ?? undefined,
          hostedUrl: inv.hosted_invoice_url ?? undefined,
          pdfUrl: inv.invoice_pdf ?? undefined,
        }
      });
    }
  } catch {
    // swallow to keep 200
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };

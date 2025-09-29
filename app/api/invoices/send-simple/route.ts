import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("SIMPLE EMAIL - Send invoice request:", JSON.stringify(body, null, 2));

    const {
      customerName,
      customerEmail,
      invoiceDate,
      items,
      subtotal,
      tax,
      total,
      emailMessage,
    } = body;

    // For now, just log the email content instead of actually sending
    console.log("=" * 50);
    console.log("📧 SIMPLE EMAIL LOG (TO SEND MANUALLY)");
    console.log("=" * 50);
    console.log("TO:", customerEmail);
    console.log("SUBJECT: Invoice from Serene Spaces -", invoiceDate);
    console.log("");
    console.log("MESSAGE:", emailMessage || "Please see attached invoice");
    console.log("");
    console.log("INVOICE DETAILS:");
    console.log("- Customer:", customerName);
    console.log("- Date:", invoiceDate);
    console.log("- Items:");
    items?.forEach((item: any, index: number) => {
      console.log(`  ${index + 1}. ${item.description} - ${item.quantity}x $${item.rate?.toFixed(2)} = $${item.amount?.toFixed(2)}`);
    });
    console.log("- Subtotal: $", subtotal?.toFixed(2));
    console.log("- Tax: $", tax?.toFixed(2));
    console.log("- TOTAL: $", total?.toFixed(2));
    console.log("");
    console.log("PAYMENT METHODS:");
    console.log("- Zelle: loveserenespaces@gmail.com");
    console.log("- Venmo: @beth-contos");
    console.log("- Cash: Due at delivery");
    console.log("=" * 50);

    // For now, return success but note that email wasn't actually sent
    return NextResponse.json({
      success: true,
      message: "Invoice logged to console. Please send manually or contact admin to fix Gmail OAuth.",
      note: "Gmail OAuth needs to be configured. Email content logged above.",
    });
  } catch (error) {
    console.error("Simple email logging error:", error);
    return NextResponse.json(
      { 
        error: "Failed to log email", 
        detail: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

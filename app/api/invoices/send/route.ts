import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_Tjn1PQUf_5RNFxHdpKb7deMjTqPXQmyTu");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      items,
      notes,
      terms,
      subtotal,
      tax,
      total,
      emailMessage,
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: customer name, email, and items are required",
        },
        { status: 400 },
      );
    }

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml({
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      invoiceDate,
      dueDate,
      items,
      notes,
      terms,
      subtotal,
      tax,
      total,
      emailMessage,
    });

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Serene Spaces <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Invoice from Serene Spaces - ${invoiceDate}`,
      html: invoiceHtml,
      replyTo: "loveserenespaces@gmail.com",
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: "Invoice sent successfully",
    });
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateInvoiceHtml(invoiceData: any) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    invoiceDate,
    dueDate,
    items,
    notes,
    terms,
    subtotal,
    tax,
    total,
    emailMessage,
  } = invoiceData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice from Serene Spaces</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7a6990; padding-bottom: 20px; }
        .company-name { font-size: 28px; font-weight: bold; color: #7a6990; margin-bottom: 10px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info, .invoice-info { flex: 1; }
        .invoice-info { text-align: right; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .items-table th { background-color: #f8fafc; font-weight: bold; }
        .totals { text-align: right; margin-bottom: 30px; }
        .total-row { font-size: 18px; font-weight: bold; color: #7a6990; }
        .notes-terms { margin-top: 30px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">Serene Spaces</div>
          <div>Professional Equestrian Cleaning Services</div>
        </div>
        
        ${
          emailMessage
            ? `
        <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
          <div style="font-size: 18px; font-weight: bold; color: #0c4a6e; margin-bottom: 10px;">📧 Personal Message</div>
          <div style="font-size: 16px; color: #0c4a6e; line-height: 1.6;">${emailMessage}</div>
        </div>
        `
            : ""
        }
        
        <div class="invoice-details">
          <div class="customer-info">
            <h3>Bill To:</h3>
            <p><strong>${customerName}</strong></p>
            ${customerEmail ? `<p>${customerEmail}</p>` : ""}
            ${customerPhone ? `<p>${customerPhone}</p>` : ""}
            ${customerAddress ? `<p>${customerAddress}</p>` : ""}
          </div>
          <div class="invoice-info">
            <h3>Invoice Details:</h3>
            <p><strong>Date:</strong> ${invoiceDate}</p>
            ${dueDate ? `<p><strong>Due Date:</strong> ${dueDate}</p>` : ""}
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              items
                .map(
                  (item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.rate.toFixed(2)}</td>
                <td>$${item.amount.toFixed(2)}</td>
              </tr>
            `,
                )
                .join("")
            }
          </tbody>
        </table>
        
        <div class="totals">
          <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>
          <p class="total-row"><strong>Total:</strong> $${total.toFixed(2)}</p>
        </div>
        
        ${
          notes || terms
            ? `
          <div class="notes-terms">
            ${notes ? `<div><strong>Notes:</strong><br>${notes}</div>` : ""}
            ${terms ? `<div style="margin-top: 15px;"><strong>Terms:</strong><br>${terms}</div>` : ""}
          </div>
        `
            : ""
        }
        
        <div class="footer">
          <p>Thank you for choosing Serene Spaces!</p>
          <p>Please contact us with any questions: loveserenespaces@gmail.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

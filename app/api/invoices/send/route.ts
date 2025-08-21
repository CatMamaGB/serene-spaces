import { NextRequest, NextResponse } from "next/server";
import { createGmailTransporter } from "@/lib/gmail-oauth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Send invoice request body:", JSON.stringify(body, null, 2));

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
      console.error("Missing required fields:", {
        customerName,
        customerEmail,
        items: items?.length,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: customer name, email, and items are required",
        },
        { status: 400 },
      );
    }

    // Validate Gmail OAuth2 configuration
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth2 configuration missing:", {
        clientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
      });
      return NextResponse.json(
        {
          error:
            "Email service configuration error - Google OAuth2 credentials not set",
        },
        { status: 500 },
      );
    }

    if (!process.env.GMAIL_REFRESH_TOKEN) {
      console.error("Gmail refresh token missing");
      return NextResponse.json(
        {
          error:
            "Email service configuration error - Gmail refresh token not set. Complete OAuth2 setup first.",
        },
        { status: 500 },
      );
    }

    console.log("Gmail OAuth2 configuration:", {
      clientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
      refreshToken: process.env.GMAIL_REFRESH_TOKEN ? "Set" : "Missing",
    });

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

    // Send email via Gmail OAuth2
    console.log("Attempting to send email via Gmail OAuth2...");
    console.log("From:", "Serene Spaces <loveserenespaces@gmail.com>");
    console.log("To:", customerEmail);
    console.log("Subject:", `Invoice from Serene Spaces - ${invoiceDate}`);

    const transporter = await createGmailTransporter();

    const mailOptions = {
      from: "Serene Spaces <loveserenespaces@gmail.com>",
      to: customerEmail,
      subject: `Invoice from Serene Spaces - ${invoiceDate}`,
      html: invoiceHtml,
      replyTo: "loveserenespaces@gmail.com",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully via Gmail:", {
      messageId: info.messageId,
      response: info.response,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Invoice sent successfully via Gmail OAuth2",
    });
  } catch (error) {
    console.error("Error sending invoice:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    // Provide more specific error information
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Test email endpoint for development
export async function GET(req: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get("email");

    if (!testEmail) {
      return NextResponse.json(
        { error: "Email parameter required" },
        { status: 400 },
      );
    }

    // Send test email via Gmail OAuth2
    const transporter = await createGmailTransporter();

    const mailOptions = {
      from: "Serene Spaces <loveserenespaces@gmail.com>",
      to: testEmail,
      subject: "Test Email from Serene Spaces",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7a6990;">🧪 Test Email</h1>
          <p>This is a test email to verify your Gmail OAuth2 setup is working correctly.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> Serene Spaces</p>
          <p><strong>To:</strong> ${testEmail}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you received this email, your Gmail OAuth2 configuration is working! 🎉
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Test email sent successfully via Gmail OAuth2",
    });
  } catch (error) {
    console.error("Error sending test email:", error);
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
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #7a6990; 
          padding-bottom: 20px; 
        }
        .company-name { 
          font-size: 28px; 
          font-weight: bold; 
          color: #7a6990; 
          margin-bottom: 10px; 
        }
        .invoice-details { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 30px; 
          flex-wrap: wrap;
        }
        .customer-info, .invoice-info { 
          flex: 1; 
          min-width: 250px;
          margin-bottom: 20px;
        }
        .invoice-info { 
          text-align: right; 
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 30px; 
        }
        .items-table th, .items-table td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #ddd; 
        }
        .items-table th { 
          background-color: #f8fafc; 
          font-weight: bold; 
        }
        .totals { 
          text-align: right; 
          margin-bottom: 30px; 
        }
        .total-row { 
          font-size: 18px; 
          font-weight: bold; 
          color: #7a6990; 
        }
        .notes-terms { 
          margin-top: 30px; 
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          color: #666; 
        }
        .personal-message {
          background-color: #f0f9ff; 
          border: 2px solid #0ea5e9; 
          border-radius: 10px; 
          padding: 20px; 
          margin: 20px 0; 
          text-align: center;
        }
        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .payment-method {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        @media (max-width: 600px) {
          .invoice-details {
            flex-direction: column;
          }
          .customer-info, .invoice-info {
            text-align: left;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">Serene Spaces</div>
          <div>Professional Horse Blanket & Equipment Care</div>
        </div>
        
        ${
          emailMessage
            ? `
        <div class="personal-message">
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
            ${items
              .map(
                (item: {
                  description: string;
                  quantity: number;
                  rate: number;
                  amount: number;
                }) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.rate.toFixed(2)}</td>
                <td>$${item.amount.toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
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
        
        <div class="payment-methods">
          <div class="payment-method">
            <div style="font-size: 2rem; margin-bottom: 12px;">💳</div>
            <h4 style="margin: 0 0 8px 0; color: #1a1a1a;">Zelle</h4>
            <p style="margin: 0; font-size: 0.9rem; color: #666; word-break: break-all;">
              loveserenespaces@gmail.com
            </p>
          </div>
          
          <div class="payment-method">
            <div style="font-size: 2rem; margin-bottom: 12px;">📱</div>
            <h4 style="margin: 0 0 8px 0; color: #1a1a1a;">Venmo</h4>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              @beth-contos
            </p>
          </div>
          
          <div class="payment-method">
            <div style="font-size: 2rem; margin-bottom: 12px;">💵</div>
            <h4 style="margin: 0 0 8px 0; color: #1a1a1a;">Cash</h4>
            <p style="margin: 0; font-size: 0.9rem; color: #666;">
              Due at delivery
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Serene Spaces!</p>
          <p>Please contact us with any questions: loveserenespaces@gmail.com or (815) 621-3509</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

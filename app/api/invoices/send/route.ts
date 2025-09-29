import { NextRequest, NextResponse } from "next/server";
import { createGmailTransporter } from "@/lib/gmail-oauth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Send invoice request body:", JSON.stringify(body, null, 2));

    const {
      invoiceId,
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

    // Validate financial fields
    if (typeof subtotal !== 'number' || typeof tax !== 'number' || typeof total !== 'number') {
      console.error("Missing or invalid financial fields:", {
        subtotal: typeof subtotal,
        tax: typeof tax,
        total: typeof total,
      });
      return NextResponse.json(
        {
          error: "Missing required financial fields: subtotal, tax, and total must be numbers",
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

    // Check for refresh token in database first, then fall back to environment
    try {
      const session = await auth();
      if (!session?.user?.id) {
        console.error("No authenticated user found");
        return NextResponse.json(
          {
            error:
              "Authentication required - Please log in to send invoices.",
          },
          { status: 401 },
        );
      }

      // Look for refresh token in GmailCredential table
      const gmailCredential = await (prisma as any).gmailCredential.findFirst({
        where: { userId: session.user.id },
      });

      if (!gmailCredential?.refreshToken && !process.env.GMAIL_REFRESH_TOKEN) {
        console.error("Gmail refresh token missing from database and environment");
        return NextResponse.json(
          {
            error:
              "Email service configuration error - Gmail OAuth not set up. Please complete Gmail authorization first.",
          },
          { status: 500 },
        );
      }

      console.log("Gmail OAuth credential found:", {
        hasDatabaseToken: !!gmailCredential?.refreshToken,
        hasEnvToken: !!process.env.GMAIL_REFRESH_TOKEN,
      });
    } catch (authError) {
      console.error("Authentication check failed:", authError);
      return NextResponse.json(
        {
          error: "Authentication error - Please log in and try again.",
        },
        { status: 401 },
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

    const transporter = await createGmailTransporter(session.user.id);
    const fromAddr = process.env.GMAIL_USER || "loveserenespaces@gmail.com";

    console.log("From:", `Serene Spaces <${fromAddr}>`);
    console.log("To:", customerEmail);
    console.log("Subject:", `Invoice from Serene Spaces - ${invoiceDate}`);

    const mailOptions = {
      from: `Serene Spaces <${fromAddr}>`, // must match the authorized Gmail
      to: customerEmail,
      cc: fromAddr, // CC yourself
      subject: `Invoice from Serene Spaces - ${invoiceDate}`,
      html: invoiceHtml,
      text: stripHtml(invoiceHtml), // plain-text fallback helps deliverability
      replyTo: fromAddr, // optional but useful
      // attachments: [
      //   { filename: `Invoice-${invoiceNumber}.pdf`, content: pdfBuffer, contentType: "application/pdf" }
      // ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully via Gmail:", {
      messageId: info.messageId,
      response: info.response,
    });

    // Update invoice status to "sent" if invoiceId is provided
    if (invoiceId) {
      try {
        await (prisma as any).invoice.update({
          where: { id: invoiceId },
          data: { status: "sent" },
        });
        console.log(
          "✅ Invoice status updated to 'sent' for invoice:",
          invoiceId,
        );
      } catch (updateError) {
        console.error("⚠️ Failed to update invoice status:", updateError);
        // Don't fail the entire request if status update fails
      }
    }

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
    const fromAddr = process.env.GMAIL_USER || "loveserenespaces@gmail.com";

    const testHtml = `
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
    `;

    const mailOptions = {
      from: `Serene Spaces <${fromAddr}>`,
      to: testEmail,
      cc: fromAddr,
      subject: "Test Email from Serene Spaces",
      html: testHtml,
      text: stripHtml(testHtml),
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

function generateInvoiceHtml(invoiceData: any) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    invoiceDate,
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
          <h4 style="margin: 0 0 20px 0; color: #1a1a1a; text-align: center;">How to Pay</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
              <h5 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1rem;">Zelle</h5>
              <p style="margin: 0; font-size: 0.9rem; color: #666; word-break: break-all;">
                loveserenespaces@gmail.com
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
              <h5 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1rem;">Venmo</h5>
              <p style="margin: 0; font-size: 0.9rem; color: #666;">
                @beth-contos
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
              <h5 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 1.1rem;">Cash</h5>
              <p style="margin: 0; font-size: 0.9rem; color: #666;">
                Due at delivery
              </p>
            </div>
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

// Utility function to strip HTML and create plain text fallback
function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|br)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

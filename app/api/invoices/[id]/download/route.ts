import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const invoiceId = resolvedParams.id;

    // Get invoice data from database
    const { prisma } = await import("@/lib/prisma");
    const invoice = await (prisma as any).invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Generate HTML for invoice
    const html = generateInvoiceHtml(invoice);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    await browser.close();

    // Return PDF file
    const filename = `Invoice-${invoice.invoiceNumber || invoiceId}.pdf`;
    
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateInvoiceHtml(invoice: any) {
  const customer = invoice.customer;
  const items = invoice.items;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const formatCurrency = (amount: number) => {
    return new Number(amount).toFixed(2);
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${invoice.invoiceNumber}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 20px;
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
        .payment-methods {
          margin: 30px 0;
        }
        .payment-method {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin: 10px 0;
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
      <div class="header">
        <div class="company-name">Serene Spaces</div>
        <div>Professional Horse Blanket & Equipment Care</div>
      </div>
      
      <div class="invoice-details">
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${customer.name}</strong></p>
          ${customer.email ? `<p>${customer.email}</p>` : ""}
          ${customer.phone ? `<p>${customer.phone}</p>` : ""}
          ${customer.address ? `<p>${customer.address}</p>` : ""}
        </div>
        <div class="invoice-info">
          <h3>Invoice Details:</h3>
          <p><strong>Invoice #:</strong> ${invoice.invoiceNumber || invoice.id}</p>
          <p><strong>Date:</strong> ${formatDate(invoice.invoiceDate)}</p>
          ${invoice.dueDate ? `<p><strong>Due:</strong> ${formatDate(invoice.dueDate)}</p>` : ""}
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
          ${items.map((item: any) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${formatCurrency(item.rate)}</td>
              <td>$${formatCurrency(item.amount)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <p><strong>Subtotal:</strong> $${formatCurrency(invoice.subtotal)}</p>
        ${invoice.tax > 0 ? `<p><strong>Tax:</strong> $${formatCurrency(invoice.tax)}</p>` : ""}
        <p class="total-row"><strong>Total:</strong> $${formatCurrency(invoice.total)}</p>
      </div>
      
      ${invoice.notes || invoice.terms ? `
        <div>
          ${invoice.notes ? `<div><strong>Notes:</strong><br>${invoice.notes}</div>` : ""}
          ${invoice.terms ? `<div style="margin-top: 15px;"><strong>Terms:</strong><br>${invoice.terms}</div>` : ""}
        </div>
      ` : ""}
      
      <div class="payment-methods">
        <h4>How to Pay</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
          <div class="payment-method">
            <h5>Zelle</h5>
            <p>loveserenespaces@gmail.com</p>
          </div>
          <div class="payment-method">
            <h5>Venmo</h5>
            <p>@beth-contos</p>
          </div>
          <div class="payment-method">
            <h5>Cash</h5>
            <p>Due at delivery</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

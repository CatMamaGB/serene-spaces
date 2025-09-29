import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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

    // Return the HTML as a downloadable file
    // Browser will show as PDF when opened
    const html = generateInvoiceHtml(invoice);
    const filename = `Invoice-${invoice.invoiceNumber || invoiceId}.html`;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("Error generating invoice download:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

function generateInvoiceHtml(invoice: any) {
  const customer = invoice.customer;
  const items = invoice.items;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    } catch (error) {
      return dateString;
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${invoice.invoiceNumber}</title>
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
      <style>
        @media print {
          body { margin: 0; padding: 20px; }
          .no-print { display: none; }
        }
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 20px;
          padding: 0;
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
        .no-print {
          position: fixed;
          top: 10px;
          right: 10px;
          background: #007bff;
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          z-index: 1000;
        }
      </style>
    </head>
    <body>
      <div class="no-print" onclick="window.print()">🖨️ Print Invoice</div>
      
      <div class="header">
        <div class="company-name">Serene Spaces</div>
        <div>Professional Horse Blanket & Equipment Care</div>
      </div>
      
      <div class="invoice-details">
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoice.customerName || customer?.name || "N/A"}</strong></p>
          ${invoice.customerEmail || customer?.email ? `<p>${invoice.customerEmail || customer?.email}</p>` : ""}
          ${invoice.customerPhone || customer?.phone ? `<p>${invoice.customerPhone || customer?.phone}</p>` : ""}
          ${invoice.customerAddress || customer?.address ? `<p>${invoice.customerAddress || customer?.address}</p>` : ""}
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
            <td>$${parseFloat(item.rate || 0).toFixed(2)}</td>
            <td>$${parseFloat(item.amount || 0).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      
      <div class="totals">
        <p><strong>Subtotal:</strong> $${parseFloat(invoice.subtotal || 0).toFixed(2)}</p>
        ${invoice.tax && invoice.tax > 0 ? `<p><strong>Tax:</strong> $${parseFloat(invoice.tax).toFixed(2)}</p>` : ""}
        <p class="total-row"><strong>Total:</strong> $${parseFloat(invoice.total || 0).toFixed(2)}</p>
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
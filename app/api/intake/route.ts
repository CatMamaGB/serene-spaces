import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createGmailTransporter } from "@/lib/gmail-oauth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      address,
      pickupMonth,
      pickupDay,
      services,
      repairNotes,
      waterproofingNotes,
      allergies,
    } = body;

    // Validate required fields
    if (!fullName || !email || !address || !services || services.length === 0) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: fullName, email, address, and at least one service",
        },
        { status: 400 },
      );
    }

    // Check if customer already exists
    let customer = await prisma.customer.findFirst({
      where: { email },
    });

    // Create new customer if they don't exist
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: fullName,
          email,
          phone: phone || null,
          address: address,
          city: "",
          state: "",
          postalCode: "",
        },
      });
    }

    // Create service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: customer.id,
        services: services,
        address: address,
        pickupDate:
          pickupMonth && pickupDay
            ? (() => {
                const currentYear = new Date().getFullYear(); // This will be 2025
                const currentDate = new Date();
                const selectedDate = new Date(`${currentYear}-${pickupMonth}-${pickupDay}`);
                
                // If the selected date is in the past, use next year
                if (selectedDate < currentDate) {
                  selectedDate.setFullYear(currentYear + 1);
                }
                
                return selectedDate;
              })()
            : null,
        repairNotes: repairNotes || null,
        waterproofingNotes: waterproofingNotes || null,
        allergies: allergies || null,
        status: "pending",
      },
    });

    // Send confirmation email
    try {
      const confirmationHtml = generateConfirmationEmail({
        fullName,
        email,
        phone,
        address,
        pickupDate:
          pickupMonth && pickupDay ? `${pickupMonth}/${pickupDay}` : undefined,
        services,
        repairNotes,
        waterproofingNotes,
        allergies,
        serviceRequestId: serviceRequest.id,
      });

      const transporter = await createGmailTransporter();
      const fromAddr = process.env.GMAIL_USER || "loveserenespaces@gmail.com";

      // Send confirmation email to customer
      await transporter.sendMail({
        from: `Serene Spaces <${fromAddr}>`,
        to: email,
        subject: "Service Request Confirmation - Serene Spaces",
        html: confirmationHtml,
        text: stripHtml(confirmationHtml),
        replyTo: fromAddr,
      });

      // Send notification email to Serene Spaces
      const notificationHtml = generateNotificationEmail({
        fullName,
        email,
        phone,
        address,
        pickupDate:
          pickupMonth && pickupDay ? `${pickupMonth}/${pickupDay}` : undefined,
        services,
        repairNotes,
        waterproofingNotes,
        allergies,
        serviceRequestId: serviceRequest.id,
      });

      await transporter.sendMail({
        from: `Serene Spaces <${fromAddr}>`,
        to: fromAddr,
        subject: `New Service Request: ${fullName} - ${services.join(", ")}`,
        html: notificationHtml,
        text: stripHtml(notificationHtml),
        replyTo: email, // So you can reply directly to the customer
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the whole request if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Service request submitted successfully",
      data: {
        customerId: customer.id,
        serviceRequestId: serviceRequest.id,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error submitting intake form:", error);
    return NextResponse.json(
      {
        error: "Failed to submit service request",
      },
      { status: 500 },
    );
  }
}

// Generate confirmation email for customer
function generateConfirmationEmail(data: {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  pickupDate?: string;
  services: string[];
  repairNotes?: string;
  waterproofingNotes?: string;
  allergies?: string;
  serviceRequestId: string;
}) {
  const {
    fullName,
    email,
    phone,
    address,
    pickupDate,
    services,
    repairNotes,
    waterproofingNotes,
    allergies,
    serviceRequestId,
  } = data;

  const formatDate = (date: string | undefined) => {
    if (!date) return "To be scheduled";
    if (date.includes("/")) {
      const [month, day] = date.split("/");
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[parseInt(month) - 1];
      return `${monthName} ${parseInt(day)}`;
    }
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Service Request Confirmation - Serene Spaces</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7a6990; padding-bottom: 20px; }
        .company-name { font-size: 32px; font-weight: bold; color: #7a6990; margin-bottom: 5px; }
        .tagline { font-size: 16px; color: #666; margin-bottom: 0; }
        .confirmation-box { background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
        .confirmation-title { font-size: 24px; font-weight: bold; color: #0c4a6e; margin-bottom: 10px; }
        .confirmation-message { font-size: 16px; color: #0c4a6e; }
        .section { margin: 25px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #7a6990; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
        .info-grid { display: table; width: 100%; }
        .info-row { display: table-row; }
        .info-label { display: table-cell; font-weight: bold; padding: 8px 15px 8px 0; color: #374151; width: 30%; }
        .info-value { display: table-cell; padding: 8px 0; color: #1f2937; }
        .services-list { list-style: none; padding: 0; margin: 0; }
        .service-item { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin: 8px 0; font-weight: 500; }
        .notes-section { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #666; }
        .contact-info { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .request-id { background-color: #7a6990; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; margin: 20px 0; }
        @media (max-width: 600px) {
          .container { padding: 10px; }
          .info-grid { display: block; }
          .info-row { display: block; margin-bottom: 10px; }
          .info-label, .info-value { display: block; }
          .info-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">Serene Spaces</div>
          <p class="tagline">Professional Equestrian Cleaning Services</p>
        </div>
        
        <div class="confirmation-box">
          <div class="confirmation-title">✅ Request Confirmed!</div>
          <p class="confirmation-message">Thank you for choosing Serene Spaces. We've received your service request and will contact you soon.</p>
        </div>

        <div class="request-id">
          Request ID: #${serviceRequestId}
        </div>
        
        <div class="section">
          <h2 class="section-title">Your Information</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${fullName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value">${email}</div>
            </div>
            ${
              phone
                ? `
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value">${phone}</div>
            </div>
            `
                : ""
            }
            <div class="info-row">
              <div class="info-label">Address:</div>
              <div class="info-value">${address}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Preferred Pickup:</div>
              <div class="info-value">${formatDate(pickupDate)}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Services Requested</h2>
          <ul class="services-list">
            ${services.map((service: string) => `<li class="service-item">• ${service}</li>`).join("")}
          </ul>
        </div>
        
        ${
          repairNotes || waterproofingNotes || allergies
            ? `
        <div class="section">
          <h2 class="section-title">Additional Information</h2>
          ${
            repairNotes
              ? `
          <div class="notes-section">
            <strong>Repair Notes:</strong><br>
            ${repairNotes}
          </div>
          `
              : ""
          }
          ${
            waterproofingNotes
              ? `
          <div class="notes-section">
            <strong>Waterproofing Notes:</strong><br>
            ${waterproofingNotes}
          </div>
          `
              : ""
          }
          ${
            allergies
              ? `
          <div class="notes-section">
            <strong>Allergies/Special Instructions:</strong><br>
            ${allergies}
          </div>
          `
              : ""
          }
        </div>
        `
            : ""
        }
        
        <div class="contact-info">
          <h2 class="section-title">What Happens Next?</h2>
          <p><strong>1. Review:</strong> We'll review your request and service needs</p>
          <p><strong>2. Contact:</strong> We'll reach out within 24 hours to confirm details and scheduling</p>
          <p><strong>3. Pickup:</strong> We'll arrange a convenient pickup time for your items</p>
          <p><strong>4. Service:</strong> Your items will receive our professional cleaning treatment</p>
          <p><strong>5. Return:</strong> We'll deliver your clean items back to you</p>
        </div>
        
        <div class="footer">
          <p><strong>Questions? Need to make changes?</strong></p>
          <p>Email us: <a href="mailto:loveserenespaces@gmail.com" style="color: #7a6990;">loveserenespaces@gmail.com</a></p>
          <p>Reference your Request ID: #${serviceRequestId}</p>
          <br>
          <p style="margin-top: 20px; font-size: 14px; color: #999;">
            Thank you for trusting Serene Spaces with your equestrian cleaning needs!
          </p>
        </div>
      </div>
    </body>
  `;
}

// Generate notification email for Serene Spaces staff
function generateNotificationEmail(data: {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  pickupDate?: string;
  services: string[];
  repairNotes?: string;
  waterproofingNotes?: string;
  allergies?: string;
  serviceRequestId: string;
}) {
  const {
    fullName,
    email,
    phone,
    address,
    pickupDate,
    services,
    repairNotes,
    waterproofingNotes,
    allergies,
    serviceRequestId,
  } = data;

  const formatDate = (date: string | undefined) => {
    if (!date) return "To be scheduled";
    if (date.includes("/")) {
      const [month, day] = date.split("/");
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthName = monthNames[parseInt(month) - 1];
      return `${monthName} ${parseInt(day)}`;
    }
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Service Request - Serene Spaces</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #7a6990; padding-bottom: 20px; }
        .company-name { font-size: 32px; font-weight: bold; color: #7a6990; margin-bottom: 5px; }
        .tagline { font-size: 16px; color: #666; margin-bottom: 0; }
        .alert-box { background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
        .alert-title { font-size: 24px; font-weight: bold; color: #92400e; margin-bottom: 10px; }
        .alert-message { font-size: 16px; color: #92400e; }
        .section { margin: 25px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #7a6990; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
        .info-grid { display: table; width: 100%; }
        .info-row { display: table-row; }
        .info-label { display: table-cell; font-weight: bold; padding: 8px 15px 8px 0; color: #374151; width: 30%; }
        .info-value { display: table-cell; padding: 8px 0; color: #1f2937; }
        .services-list { list-style: none; padding: 0; margin: 0; }
        .service-item { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin: 8px 0; font-weight: 500; }
        .notes-section { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #666; }
        .request-id { background-color: #7a6990; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; margin: 20px 0; }
        .action-buttons { text-align: center; margin: 20px 0; }
        .action-button { display: inline-block; background-color: #7a6990; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; font-weight: 500; }
        @media (max-width: 600px) {
          .container { padding: 10px; }
          .info-grid { display: block; }
          .info-row { display: block; margin-bottom: 10px; }
          .info-label, .info-value { display: block; }
          .info-label { margin-bottom: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="company-name">Serene Spaces</div>
          <p class="tagline">Professional Equestrian Cleaning Services</p>
        </div>
        
        <div class="alert-box">
          <div class="alert-title">🚨 New Service Request!</div>
          <p class="alert-message">A customer has submitted a new service request that requires your attention.</p>
        </div>

        <div class="request-id">
          Request ID: #${serviceRequestId}
        </div>
        
        <div class="section">
          <h2 class="section-title">Customer Information</h2>
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Name:</div>
              <div class="info-value">${fullName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email:</div>
              <div class="info-value"><a href="mailto:${email}" style="color: #7a6990;">${email}</a></div>
            </div>
            ${
              phone
                ? `
            <div class="info-row">
              <div class="info-label">Phone:</div>
              <div class="info-value"><a href="tel:${phone}" style="color: #7a6990;">${phone}</a></div>
            </div>
            `
                : ""
            }
            <div class="info-row">
              <div class="info-label">Address:</div>
              <div class="info-value">${address}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Preferred Pickup:</div>
              <div class="info-value">${formatDate(pickupDate)}</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2 class="section-title">Services Requested</h2>
          <ul class="services-list">
            ${services.map((service: string) => `<li class="service-item">• ${service}</li>`).join("")}
          </ul>
        </div>
        
        ${
          repairNotes || waterproofingNotes || allergies
            ? `
        <div class="section">
          <h2 class="section-title">Additional Information</h2>
          ${
            repairNotes
              ? `
          <div class="notes-section">
            <strong>Repair Notes:</strong><br>
            ${repairNotes}
          </div>
          `
              : ""
          }
          ${
            waterproofingNotes
              ? `
          <div class="notes-section">
            <strong>Waterproofing Notes:</strong><br>
            ${waterproofingNotes}
          </div>
          `
              : ""
          }
          ${
            allergies
              ? `
          <div class="notes-section">
            <strong>Allergies/Special Instructions:</strong><br>
            ${allergies}
          </div>
          `
              : ""
          }
        </div>
        `
            : ""
        }
        
        <div class="action-buttons">
          <a href="https://www.loveserenespaces.com/admin/service-requests" class="action-button">View in Admin Panel</a>
          <a href="mailto:${email}?subject=Re: Service Request #${serviceRequestId}" class="action-button">Reply to Customer</a>
        </div>
        
        <div class="footer">
          <p><strong>Next Steps:</strong></p>
          <p>1. Review the customer's request and requirements</p>
          <p>2. Contact the customer within 24 hours to confirm details</p>
          <p>3. Schedule pickup and discuss any special needs</p>
          <p>4. Update the request status in your admin panel</p>
          <br>
          <p style="margin-top: 20px; font-size: 14px; color: #999;">
            This email was automatically generated when a customer submitted a service request.
          </p>
        </div>
      </div>
    </body>
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

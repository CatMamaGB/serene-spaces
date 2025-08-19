import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      pickupDate, 
      services, 
      repairNotes, 
      waterproofingNotes, 
      allergies 
    } = body;

    // Validate required fields
    if (!fullName || !email || !address || !services || services.length === 0) {
      return NextResponse.json({ 
        error: "Missing required fields: fullName, email, address, and at least one service" 
      }, { status: 400 });
    }

    // Check if customer already exists
    let customer = await prisma.customer.findFirst({
      where: { email }
    });

    // Create new customer if they don't exist
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: fullName,
          email,
          phone: phone || null,
          address: address, // Use the address field from schema
          city: '', // Will be extracted from address if needed
          state: '', // Will be extracted from address if needed
          postalCode: '' // Use postalCode instead of zipCode
        }
      });
    }

    // Create service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: customer.id,
        services: services,
        address: address,
        pickupDate: pickupDate ? new Date(pickupDate) : null,
        repairNotes: repairNotes || null,
        waterproofingNotes: waterproofingNotes || null,
        allergies: allergies || null,
        status: 'pending'
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Service request submitted successfully',
      data: {
        customerId: customer.id,
        serviceRequestId: serviceRequest.id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error submitting intake form:', error);
    return NextResponse.json({ 
      error: 'Failed to submit service request' 
    }, { status: 500 });
  }
}

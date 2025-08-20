import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    // Check if API key is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: "RESEND_API_KEY not set",
        status: "missing"
      });
    }

    console.log("API Key found:", process.env.RESEND_API_KEY ? "Yes" : "No");
    console.log("API Key length:", process.env.RESEND_API_KEY?.length || 0);

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Try to send a simple test email
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's default domain for testing
      to: "test@example.com",
      subject: "Test Email from Serene Spaces",
      html: "<p>This is a test email to verify Resend is working.</p>",
    });

    if (error) {
      console.error("Resend test error:", JSON.stringify(error, null, 2));
      return NextResponse.json({
        error: "Resend API error",
        details: error.message || "Unknown error",
        code: "resend_error",
        status: "resend_error"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Resend connection successful",
      messageId: data?.id,
      status: "working"
    });

  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "exception"
    });
  }
}

import { NextResponse } from "next/server";
import { createGmailTransporter, testGmailConnection } from "@/lib/gmail-oauth";

export async function GET() {
  try {
    // Check if OAuth2 credentials are set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({
        error: "Google OAuth2 credentials not set",
        status: "missing",
        details: {
          clientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
        },
      });
    }

    if (!process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json({
        error: "Gmail refresh token not set",
        status: "missing",
        details: {
          refreshToken: "Missing - Complete OAuth2 setup first",
          setupUrl: "/api/auth/gmail-setup",
        },
      });
    }

    console.log("Gmail OAuth2 credentials found:", {
      clientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
      refreshToken: process.env.GMAIL_REFRESH_TOKEN ? "Set" : "Missing",
    });

    // Test Gmail connection
    const connectionTest = await testGmailConnection();

    if (!connectionTest.success) {
      return NextResponse.json({
        error: "Gmail OAuth2 connection failed",
        status: "connection_failed",
        details: connectionTest.error,
      });
    }

    // Try to send a simple test email
    const transporter = await createGmailTransporter();

    const mailOptions = {
      from: "Serene Spaces <loveserenespaces@gmail.com>",
      to: "test@example.com",
      subject: "Test Email from Serene Spaces",
      html: "<p>This is a test email to verify Gmail OAuth2 is working.</p>",
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Gmail OAuth2 connection successful",
      messageId: info.messageId,
      status: "working",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json({
      error: "Test failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "exception",
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("🐛 DEBUG: Starting invoice send debug");
    
    // Check authentication
    const session = await auth();
    console.log("🐛 DEBUG: Session check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        step: "authentication",
        status: "failed",
        error: "No authenticated user found",
        message: "Please log in as admin to send invoices"
      }, { status: 401 });
    }

    // Check Gmail credentials
    const gmailCredential = await (prisma as any).gmailCredential.findFirst({
      where: { userId: session.user.id },
    });
    
    console.log("🐛 DEBUG: Gmail credential check:", {
      found: !!gmailCredential,
      tokenLength: gmailCredential?.refreshToken?.length || 0,
    });

    if (!gmailCredential?.refreshToken && !process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json({
        step: "gmail_credential",
        status: "failed", 
        error: "No Gmail refresh token found",
        message: "Complete Gmail OAuth authorization first"
      }, { status: 500 });
    }

    // Test Gmail transporter creation
    try {
      const { createGmailTransporter } = await import("@/lib/gmail-oauth");
      console.log("🐛 DEBUG: Attempting to create Gmail transporter for user:", session.user.id);
      
      const transporter = await createGmailTransporter(session.user.id);
      console.log("🐛 DEBUG: Gmail transporter created successfully");

      // Test email sending
      const testMailOptions = {
        from: "Serene Spaces <loveserenespaces@gmail.com>",
        to: "loveserenespaces@gmail.com", // Send to self for testing
        subject: "🧪 Debug Test Email",
        text: "This is a test email from the debug endpoint."
      };

      console.log("🐛 DEBUG: Attempting to send test email");
      const info = await transporter.sendMail(testMailOptions);
      console.log("🐛 DEBUG: Test email sent successfully:", {
        messageId: info.messageId,
        response: info.response,
      });

      return NextResponse.json({
        step: "complete",
        status:我来创建一个调试端点来捕获具体的错误信息：我正在创建一个调试端点来捕获具体的错误信息：我正在创建一个调试端点来捕获具体的错误信息：
<function name="write">
我来创建一个调试端点来捕获具体的错误信息：
<parameter name="file_path">app/api/debug/invoice-send/route.ts</parameter>
<parameter name="contents">import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("🐛 DEBUG: Starting invoice send debug");
    
    // Check authentication
    const session = await auth();
    console.log("🐛 DEBUG: Session check:", {
      hasSession: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        step: "authentication",
        status: "failed",
        error: "No authenticated user found",
        message: "Please log in as admin to send invoices"
      }, { status: 401 });
    }

    // Check Gmail credentials
    const gmailCredential = await (prisma as any).gmailCredential.findFirst({
      where: { userId: session.user.id },
    });
    
    console.log("🐛 DEBUG: Gmail credential check:", {
      found: !!gmailCredential,
      tokenLength: gmailCredential?.refreshToken?.length || 0,
    });

    if (!gmailCredential?.refreshToken && !process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json({
        step: "gmail_credential",
        status: "failed", 
        error: "No Gmail refresh token found",
        message: "Complete Gmail OAuth authorization first"
      }, { status: 500 });
    }

    // Test Gmail transporter creation
    try {
      const { createGmailTransporter } = await import("@/lib/gmail-oauth");
      console.log("🐛 DEBUG: Attempting to create Gmail transporter for user:", session.user.id);
      
      const transporter = await createGmailTransporter(session.user.id);
      console.log("🐛 DEBUG: Gmail transporter created successfully");

      // Test email sending - remove this since it might cause issues
      return NextResponse.json({
        step: "transporter_created",
        status: "success",
        message: "Gmail transporter created successfully, ready for invoice sending",
        userId: session.user.id,
        hasToken: !!gmailCredential?.refreshToken,
        tokenLength: gmailCredential?.refreshToken?.length || 0,
      });
    } catch (transporterError) {
      console.error("🐛 DEBUG: Transporter creation failed:", transporterError);
      return NextResponse.json({
        step: "transporter_creation",
        status: "failed",
        error: transporterError instanceof Error ? transporterError.message : "Unknown transporter error",
        stack: transporterError instanceof Error ? transporterError.stack : undefined,
        userId: session.user.id,
        message: "Failed to create Gmail transporter"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("🐛 DEBUG: General error:", error);
    return NextResponse.json({
      step: "general_error",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      message: "Debug endpoint encountered an error"
    }, { status: 500 });
  }
}</parameter>
</function>我需要修复这个包含错误字符的文件。让我重新创建：
<function name="write">
<parameter name="file_path">app/api/debug/invoice-send/route.ts</parameter>
<parameter name="contents">import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    console.log("DEBUG: Starting invoice send debug");
    
    // Check authentication
    const session = await auth();
    console.log("DEBUG: Session check:", {
      hasSession: !!session,
      userId:session?.user?.id,
      userEmail: session?.user?.email,
    });

    if (!session?.user?.id) {
      return NextResponse.json({
        step: "authentication",
        status: "failed",
        error: "No authenticated user found",
        message: "Please log in as admin to send invoices"
      }, { status: 401 });
    }

    // Check Gmail credentials
    const gmailCredential = await (prisma as any).gmailCredential.findFirst({
      where: { userId: session.user.id },
    });
    
    console.log("DEBUG: Gmail credential check:" , {
      found: !!gmailCredential,
      tokenLength: gmailCredential?.refreshToken?.length || 0,
    });

    if (!gmailCredential?.refreshToken && !process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json({
        step: "gmail_credential",
        status: "failed", 
        error: "No Gmail refresh token found",
        message: "Complete Gmail OAuth authorization first"
      }, { status: 500 });
    }

    // Test Gmail transporter creation
    try {
      const { createGmailTransporter } = await import("@/lib/gmail-oauth");
      console.log("DEBUG: Attempting to create Gmail transporter for user:", session.user.id);
      
      const transporter = await createGmailTransporter(session.user.id);
      console.log("DEBUG: Gmail transporter created successfully");

      return NextResponse.json({
        step: "transporter_created",
        status: "success",
        message: "Gmail transporter created successfully, ready for invoice sending",
        userId: session.user.id,
        hasToken: !!gmailCredential?.refreshToken,
        tokenLength: gmailCredential?.refreshToken?.length || 0,
      });
    } catch (transporterError) {
      console.error("Transporter creation failed:", transporterError);
      return NextResponse.json({
        step: "transporter_creation",
        status: "failed",
        error: transporterError instanceof Error ? transporterError.message : "Unknown transporter error",
        stack: transporterError instanceof Error ? transporterError.stack : undefined,
        userId: session.user.id,
        message: "Failed to create Gmail transporter"
      }, { status: 500 });
    }

  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json({
      step: "general_error",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      message: "Debug endpoint encountered an error"
    }, { status: 500 });
  }
}</parameter>
</function>Let me try to test what the specific error might be by calling the debug endpoint:
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
run_terminal_cmd

import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

interface DiagnosticReport {
  env: {
    hasClientId: boolean;
    hasClientSecret: boolean;
    hasRedirectUri: boolean;
    hasRefreshToken: boolean;
    gmailUser: string;
  };
  oauth?: {
    mintedAccessToken: boolean;
    tokenValid: boolean;
    accessTokenLength?: number;
    refreshTokenLength?: number;
  };
  smtp?: {
    verified: boolean;
  };
  debug?: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    refreshToken: string;
    user: string;
  };
  error?: {
    message?: string;
    code?: string;
    response?: unknown;
    command?: string;
  };
}

export async function GET() {
  const report: DiagnosticReport = {
    env: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      hasRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
      gmailUser: process.env.GMAIL_USER || "loveserenespaces@gmail.com",
    },
  };

  try {
    // 1) Can we mint an access token from the refresh token?
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!,
    );
    oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN! });

    const { token } = await oauth2.getAccessToken();
    report.oauth = {
      mintedAccessToken: !!token,
      tokenValid: !!token,
      accessTokenLength: token?.length || 0,
      refreshTokenLength: process.env.GMAIL_REFRESH_TOKEN?.length || 0,
    };

    // Add debug info (be careful with sensitive data in production)
    report.debug = {
      clientId:
        process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "..." || "missing",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET?.substring(0, 20) + "..." || "missing",
      redirectUri: process.env.GOOGLE_REDIRECT_URI || "missing",
      refreshToken:
        process.env.GMAIL_REFRESH_TOKEN?.substring(0, 20) + "..." || "missing",
      user: process.env.GMAIL_USER || "loveserenespaces@gmail.com",
    };

    // 2) Build the transporter with XOAUTH2 - EXACTLY like createGmailTransporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER || "loveserenespaces@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
        accessToken: token || undefined,
      },
    });

    // 3) Verify SMTP auth with Gmail - this is the real test!
    await transporter.verify();
    report.smtp = { verified: true };
    return NextResponse.json(report);
  } catch (e: unknown) {
    const error = e as Error & {
      code?: string;
      response?: unknown;
      command?: string;
    };

    report.error = {
      message: error?.message,
      code: error?.code,
      response: error?.response,
      command: error?.command,
    };
    return NextResponse.json(report, { status: 500 });
  }
}

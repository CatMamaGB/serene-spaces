import { NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";

export async function GET() {
  const report: any = {
    env: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      hasRefreshToken: !!process.env.GMAIL_REFRESH_TOKEN,
      gmailUser: process.env.GMAIL_USER || "(missing)",
    },
  };

  try {
    // 1) Can we mint an access token from the refresh token?
    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );
    oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN! });

    const { token } = await oauth2.getAccessToken();
    report.oauth = { mintedAccessToken: !!token };

    // 2) Which Google account does this token belong to?
    const who = google.oauth2({ version: "v2", auth: oauth2 });
    const { data: me } = await who.userinfo.get();
    report.oauth.email = me.email || "(unknown)";

    // 3) Build the transporter with XOAUTH2 (no password!)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER!,
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
        accessToken: token || undefined,
      },
    });

    // 4) Verify SMTP auth with Gmail
    await transporter.verify();
    report.smtp = { verified: true };
    return NextResponse.json(report);
  } catch (e: any) {
    report.error = {
      message: e?.message,
      code: e?.code,
      response: e?.response,
      command: e?.command,
    };
    return NextResponse.json(report, { status: 500 });
  }
}

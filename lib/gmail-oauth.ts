import { google } from "googleapis";
import nodemailer from "nodemailer";
import { logger } from "./logger";

/** Google OAuth refresh failed — token revoked, expired, or client config changed. */
export function isGmailInvalidGrantError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  if (/invalid_grant/i.test(msg)) return true;
  const any = err as { response?: { data?: { error?: string } } };
  return any?.response?.data?.error === "invalid_grant";
}

export function gmailInvalidGrantHelp(baseUrl?: string): string {
  const origin =
    baseUrl?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://www.loveserenespaces.com";
  return (
    `Gmail OAuth refresh token is invalid or revoked (${origin}/api/gmail/connect while signed in as admin, ` +
    `or revoke the app at https://myaccount.google.com/permissions and connect again). ` +
    `If you use GMAIL_REFRESH_TOKEN in Vercel, replace it after re-authorizing.`
  );
}

// Create OAuth2 client
const createOAuth2Client = () => {
  const redirectUri =
    process.env.GMAIL_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    (process.env.NODE_ENV === "production"
      ? "https://www.loveserenespaces.com/api/gmail/callback/google"
      : "http://localhost:3000/api/gmail/callback/google");

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  );
};

// Create Gmail transporter using OAuth2
export const createGmailTransporter = async (userId?: string) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth2 credentials not configured");
  }

  // Prioritize database token over environment variable
  let refreshToken = null;
  
  if (!refreshToken) {
    // Load from database if available
    if (userId) {
      try {
        const { prisma } = await import("./prisma");
        const credential = await (prisma as any).gmailCredential.findFirst({
          where: { userId }
        });
        refreshToken = credential?.refreshToken;
      } catch (dbError) {
        logger.debug("Could not load refresh token from database:", dbError);
      }
    } else {
      // Fallback to latest token if no userId provided
      try {
        const { prisma } = await import("./prisma");
        const credential = await (prisma as any).gmailCredential.findFirst({
          orderBy: { updatedAt: 'desc' }
        });
        refreshToken = credential?.refreshToken;
      } catch (dbError) {
        logger.debug("Could not load refresh token from database:", dbError);
      }
    }
  }

  // Fallback to environment variable only if no database token found
  if (!refreshToken) {
    refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  }

  if (!refreshToken) {
    throw new Error(
      "Gmail refresh token not configured. Complete OAuth2 setup first.",
    );
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Get a short-lived access token from Google (Nodemailer will not refresh by itself)
  let accessToken: string | null | undefined;
  try {
    const res = await oauth2Client.getAccessToken();
    accessToken = res.token;
  } catch (e) {
    if (isGmailInvalidGrantError(e)) {
      logger.error(`[gmail-oauth] ${gmailInvalidGrantHelp()}`);
    } else {
      logger.errorFrom("Gmail getAccessToken", e);
    }
    throw e;
  }
  if (!accessToken) throw new Error("Failed to get access token");

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER || "loveserenespaces@gmail.com", // Must match OAuth-authorized account
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken, // include so first send succeeds immediately
    },
  });
};

import { google } from "googleapis";
import nodemailer from "nodemailer";
import { getGmailOAuthRedirectUri, getPublicSiteOrigin } from "./env-server";
import { logger } from "./logger";

/** Google OAuth refresh failed — token revoked, expired, or client config changed. */
export function isGmailInvalidGrantError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  if (/invalid_grant/i.test(msg)) return true;
  const any = err as { response?: { data?: { error?: string } } };
  return any?.response?.data?.error === "invalid_grant";
}

export function gmailInvalidGrantHelp(baseUrl?: string): string {
  const origin = getPublicSiteOrigin(baseUrl);
  return (
    `Gmail OAuth refresh token is invalid or revoked (${origin}/api/gmail/connect while signed in as admin, ` +
    `or revoke the app at https://myaccount.google.com/permissions and connect again). ` +
    `If you use GMAIL_REFRESH_TOKEN in Vercel, replace it after re-authorizing.`
  );
}

/** Gmail SMTP rejected credentials (not the same as OAuth invalid_grant). */
export function isGmailSmtp535Error(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    /535[\s-]/i.test(msg) ||
    /BadCredentials/i.test(msg) ||
    /Username and Password not accepted/i.test(msg)
  );
}

/** Use in API route catch blocks after createGmailTransporter/sendMail — avoids duplicate logs for invalid_grant. */
export function logGmailEmailFailure(context: string, err: unknown): void {
  if (isGmailInvalidGrantError(err)) return;
  logger.errorFrom(context, err);
  if (isGmailSmtp535Error(err)) {
    logger.error(
      "[gmail-oauth] SMTP 535 — GMAIL_USER must be the exact Google address that authorized /api/gmail/connect (same inbox). Recheck Vercel GMAIL_USER and reconnect Gmail.",
    );
  }
}

/** SMTP / OAuth2 envelope username — must match authorized Google account. */
export function getGmailSmtpUser(): string {
  return (
    process.env.GMAIL_USER?.trim().toLowerCase() || "loveserenespaces@gmail.com"
  );
}

// Create OAuth2 client (redirect URI must match connect/callback routes — see getGmailOAuthRedirectUri)
const createOAuth2Client = () => {
  const redirectUri = getGmailOAuthRedirectUri();

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  );
};

/** Load refresh token + return OAuth2 client with a valid access token (Gmail API + SMTP). */
export async function getGmailOAuth2Client(userId?: string) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth2 credentials not configured");
  }

  let refreshToken: string | null = null;

  if (userId) {
    try {
      const { prisma } = await import("./prisma");
      const credential = await (prisma as any).gmailCredential.findFirst({
        where: { userId },
      });
      refreshToken = credential?.refreshToken ?? null;
    } catch (dbError) {
      logger.debug("Could not load refresh token from database:", dbError);
    }
  } else {
    try {
      const { prisma } = await import("./prisma");
      const credential = await (prisma as any).gmailCredential.findFirst({
        orderBy: { updatedAt: "desc" },
      });
      refreshToken = credential?.refreshToken ?? null;
    } catch (dbError) {
      logger.debug("Could not load refresh token from database:", dbError);
    }
  }

  if (!refreshToken) {
    refreshToken = process.env.GMAIL_REFRESH_TOKEN ?? null;
  }

  if (!refreshToken) {
    throw new Error(
      "Gmail refresh token not configured. Complete OAuth2 setup first.",
    );
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const res = await oauth2Client.getAccessToken();
    if (!res.token) throw new Error("Failed to get access token");
  } catch (e) {
    if (isGmailInvalidGrantError(e)) {
      logger.error(`Gmail OAuth invalid_grant — ${gmailInvalidGrantHelp()}`);
    } else {
      logger.errorFrom("Gmail getAccessToken", e);
    }
    throw e;
  }

  return oauth2Client;
}

/** Legacy SMTP path (invoice send, etc.). Prefer Gmail API where possible. */
export const createGmailTransporter = async (userId?: string) => {
  const oauth2Client = await getGmailOAuth2Client(userId);
  const refreshToken = oauth2Client.credentials.refresh_token;
  const accessToken = oauth2Client.credentials.access_token;
  if (!refreshToken || !accessToken) {
    throw new Error("Missing OAuth credentials after refresh");
  }

  const smtpUser = getGmailSmtpUser();
  const expiresAt = oauth2Client.credentials.expiry_date ?? undefined;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: smtpUser,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken,
      ...(typeof expiresAt === "number" ? { expires: expiresAt } : {}),
    },
  });
};

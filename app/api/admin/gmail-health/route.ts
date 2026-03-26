import { google } from "googleapis";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getGmailOAuth2Client,
  getGmailSmtpUser,
  isGmailInvalidGrantError,
} from "@/lib/gmail-oauth";
import { getGmailOAuthRedirectUri, getPublicSiteOrigin } from "@/lib/env-server";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin-only: shows which Gmail-related env is set (no secret values) and
 * whether OAuth can obtain an access token. Use after rotating GOOGLE_CLIENT_SECRET.
 */
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasClientId = !!process.env.GOOGLE_CLIENT_ID?.trim();
    const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET?.trim();
    const gmailUser = getGmailSmtpUser();
    const hasGmailUserEnv = !!process.env.GMAIL_USER?.trim();
    const hasEnvRefresh = !!process.env.GMAIL_REFRESH_TOKEN?.trim();

    let dbHasRefresh = false;
    let dbCredentialUpdatedAt: string | null = null;
    try {
      const row = await (prisma as any).gmailCredential.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { refreshToken: true, updatedAt: true },
      });
      dbHasRefresh = typeof row?.refreshToken === "string" && row.refreshToken.length > 10;
      dbCredentialUpdatedAt = row?.updatedAt
        ? new Date(row.updatedAt).toISOString()
        : null;
    } catch (e) {
      logger.errorFrom("gmail-health db", e);
    }

    const origin = getPublicSiteOrigin(new URL(req.url).origin);
    const redirectUri = getGmailOAuthRedirectUri(new URL(req.url).origin);

    const checklist = {
      GOOGLE_CLIENT_ID: hasClientId,
      GOOGLE_CLIENT_SECRET: hasClientSecret,
      GMAIL_USER: hasGmailUserEnv,
      /** Resolved mailbox used for SMTP From + OAuth user */
      resolvedSmtpUser: gmailUser,
      GMAIL_REFRESH_TOKEN_in_Vercel: hasEnvRefresh,
      database_refresh_token: dbHasRefresh,
      database_gmail_credential_updated_at: dbCredentialUpdatedAt,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL?.trim(),
      GOOGLE_REDIRECT_URI_or_GMAIL_REDIRECT_URI:
        !!process.env.GOOGLE_REDIRECT_URI?.trim() ||
        !!process.env.GMAIL_REDIRECT_URI?.trim(),
      resolved_oauth_redirect_uri: redirectUri,
      public_site_origin: origin,
    };

    let accessTokenProbe: "skipped" | "ok" | "invalid_grant" | "missing_refresh" | "error" =
      "skipped";
    let probeDetail = "";
    let gmailApiProbe: "skipped" | "ok" | "forbidden" | "error" = "skipped";
    let gmailApiDetail = "";

    if (!hasClientId || !hasClientSecret) {
      accessTokenProbe = "skipped";
      probeDetail = "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel.";
    } else if (!dbHasRefresh && !hasEnvRefresh) {
      accessTokenProbe = "missing_refresh";
      probeDetail =
        "No refresh token: open /api/gmail/connect while signed in as admin (same Google account as GMAIL_USER), or set GMAIL_REFRESH_TOKEN.";
    } else {
      try {
        const oauth2Client = await getGmailOAuth2Client();
        accessTokenProbe = "ok";
        probeDetail =
          "OAuth returned an access token. Public mail uses Gmail API (users.messages.send), not SMTP.";
        try {
          const gmail = google.gmail({ version: "v1", auth: oauth2Client });
          await gmail.users.getProfile({ userId: "me" });
          gmailApiProbe = "ok";
          gmailApiDetail =
            "Gmail API is reachable (Gmail API enabled for this Cloud project).";
        } catch (apiErr: unknown) {
          const any = apiErr as { code?: number };
          if (any?.code === 403) {
            gmailApiProbe = "forbidden";
            gmailApiDetail =
              "Enable Gmail API in Google Cloud (APIs & Services → Library → Gmail API → Enable).";
          } else {
            gmailApiProbe = "error";
            gmailApiDetail =
              apiErr instanceof Error ? apiErr.message : String(apiErr);
          }
        }
      } catch (e) {
        if (isGmailInvalidGrantError(e)) {
          accessTokenProbe = "invalid_grant";
          probeDetail =
            "Refresh token was issued for a different OAuth client secret or was revoked. After changing GOOGLE_CLIENT_SECRET in Google Cloud, run Reconnect Gmail again (/api/gmail/connect).";
        } else {
          accessTokenProbe = "error";
          probeDetail = e instanceof Error ? e.message : String(e);
        }
      }
    }

    return NextResponse.json({
      ok: accessTokenProbe === "ok" && gmailApiProbe === "ok",
      accessTokenProbe,
      probeDetail,
      gmailApiProbe,
      gmailApiDetail,
      checklist,
      actions:
        accessTokenProbe === "invalid_grant" || accessTokenProbe === "missing_refresh"
          ? [
              "1. In Google Cloud Console, confirm OAuth client ID + NEW client secret match Vercel.",
              "2. Authorized redirect URI must include exactly: " + redirectUri,
              "3. Visit " + origin + "/api/gmail/connect while logged into Google as " + gmailUser,
              "4. Optional: remove stale GMAIL_REFRESH_TOKEN from Vercel if you rely on DB token only, then reconnect.",
            ]
          : accessTokenProbe === "ok"
            ? [
                gmailApiProbe === "forbidden"
                  ? "Enable Gmail API for the OAuth client’s Google Cloud project (required for contact/intake email)."
                  : "If emails still do not arrive, check spam and that CONTACT_NOTIFY_EMAIL / notify addresses match your workflow.",
              ]
            : [],
    });
  } catch (e) {
    logger.errorFrom("GET /api/admin/gmail-health", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

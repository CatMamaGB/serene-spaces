import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import { logger } from "./logger";

/** RFC 2047 for non-ASCII subjects */
function encodeSubject(subject: string): string {
  if (/^[\x00-\x7F]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

function buildRawRfc822(params: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): string {
  const lines: string[] = [
    `From: ${params.from}`,
    `To: ${params.to}`,
    `Subject: ${encodeSubject(params.subject)}`,
  ];
  if (params.replyTo) {
    lines.push(`Reply-To: ${params.replyTo}`);
  }
  lines.push("MIME-Version: 1.0");

  if (params.text) {
    const boundary = `bnd_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
    lines.push("");
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/plain; charset=UTF-8");
    lines.push("");
    lines.push(params.text.replace(/\r?\n/g, "\r\n"));
    lines.push(`--${boundary}`);
    lines.push("Content-Type: text/html; charset=UTF-8");
    lines.push("");
    lines.push(params.html);
    lines.push(`--${boundary}--`);
  } else {
    lines.push("Content-Type: text/html; charset=UTF-8");
    lines.push("");
    lines.push(params.html);
  }

  return lines.join("\r\n");
}

/** Gmail API expects URL-safe base64 without padding */
function toRawBase64Url(raw: string): string {
  return Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Send one message via Gmail API (not SMTP). Uses OAuth2 + gmail.send scope.
 * Avoids SMTP 535/XOAUTH2 issues on some hosts.
 */
export async function sendGmailApiMessage(
  oauth2Client: OAuth2Client,
  params: {
    fromDisplay: string;
    fromEmail: string;
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
  },
): Promise<void> {
  const from = `${params.fromDisplay} <${params.fromEmail}>`;
  const raw = buildRawRfc822({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: toRawBase64Url(raw),
    },
  });
}

/** Log Gmail REST API errors with a hint when Gmail API is disabled. */
export function logGmailApiFailure(context: string, err: unknown): void {
  const any = err as { code?: number; errors?: { reason?: string }[] };
  logger.errorFrom(context, err);
  if (any?.code === 403) {
    logger.error(
      "[gmail-api] 403 — Enable 'Gmail API' for this Google Cloud project (APIs & Services → Library → Gmail API → Enable).",
    );
  }
  if (any?.code === 401) {
    logger.error(
      "[gmail-api] 401 — Reconnect Gmail (/api/gmail/connect); token may be invalid.",
    );
  }
}

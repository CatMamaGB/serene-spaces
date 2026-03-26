/**
 * Server-side environment variables — aligned with Vercel project settings.
 *
 * Database (Prisma runtime uses first non-empty value):
 * - PRISMA_DATABASE_URL — Prisma Postgres / Accelerate
 * - DATABASE_URL — primary URL in prisma/schema.prisma (migrations & CLI)
 * - POSTGRES_URL — often set alongside DATABASE_URL on hosted Postgres
 *
 * Auth (NextAuth / Auth.js):
 * - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET — Google provider + Gmail API
 * - NEXTAUTH_URL — canonical site URL for callbacks
 * - NEXTAUTH_SECRET — required in production (set in Vercel if not listed in UI snapshot)
 *
 * App URLs:
 * - NEXT_PUBLIC_APP_URL — canonical origin (e.g. https://www.loveserenespaces.com)
 *
 * Gmail send (OAuth):
 * - GMAIL_USER — mailbox for OAuth SMTP + From: header (must match the Google account used at /api/gmail/connect)
 * - GMAIL_REFRESH_TOKEN — optional fallback when DB has no GmailCredential row
 * - GOOGLE_REDIRECT_URI — optional; full callback URL. Same as GMAIL_REDIRECT_URI if set.
 *   Must match Google Cloud Console "Authorized redirect URIs" exactly.
 *
 * Optional:
 * - CONTACT_NOTIFY_EMAIL — inbox for contact-form notifications (else GMAIL_USER)
 * - ADMIN_EMAIL, ADMIN_PASSWORD_HASH — credentials provider
 */

/** Resolved DB URL for PrismaClient at runtime (Accelerate or direct). */
export function getResolvedDatabaseUrl(): string | undefined {
  const u =
    process.env.PRISMA_DATABASE_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim();
  return u || undefined;
}

export function isDatabaseConfigured(): boolean {
  return !!getResolvedDatabaseUrl();
}

/**
 * Gmail OAuth redirect URI — must be identical in:
 * - Google Cloud Console (Authorized redirect URIs)
 * - OAuth2Client used in connect, callback, and refresh (createGmailTransporter)
 */
export function getGmailOAuthRedirectUri(requestOrigin?: string): string {
  const explicit = (
    process.env.GMAIL_REDIRECT_URI ||
    process.env.GOOGLE_REDIRECT_URI ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  if (explicit) return explicit;

  const base = (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    requestOrigin?.replace(/\/$/, "") ||
    ""
  ).trim().replace(/\/$/, "");
  if (base) return `${base}/api/gmail/callback/google`;

  return process.env.NODE_ENV === "production"
    ? "https://www.loveserenespaces.com/api/gmail/callback/google"
    : "http://localhost:3000/api/gmail/callback/google";
}

/** Site origin for redirects and help text (no trailing slash). */
export function getPublicSiteOrigin(requestOrigin?: string): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    requestOrigin?.replace(/\/$/, "") ||
    (process.env.NODE_ENV === "production"
      ? "https://www.loveserenespaces.com"
      : "http://localhost:3000")
  );
}

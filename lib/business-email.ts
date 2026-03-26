/** Inbox for website notifications — CONTACT_NOTIFY_EMAIL, else GMAIL_USER (see lib/env-server.ts). */
export function getBusinessNotifyEmail(): string {
  const fromEnv =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    process.env.GMAIL_USER?.trim() ||
    "";
  return fromEnv || "loveserenespaces@gmail.com";
}

/** Inbox for website notifications (contact form, etc.). */
export function getBusinessNotifyEmail(): string {
  const fromEnv =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    process.env.GMAIL_USER?.trim() ||
    "";
  return fromEnv || "loveserenespaces@gmail.com";
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  createGmailTransporter,
  getGmailSmtpUser,
  logGmailEmailFailure,
} from "@/lib/gmail-oauth";
import { logger } from "@/lib/logger";
import { getClientIpFromHeaders } from "@/lib/client-ip";
import { checkContactRateLimit } from "@/lib/contact-rate-limit";
import { getBusinessNotifyEmail } from "@/lib/business-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      message,
      website: honeypotWebsite,
    } = body ?? {};

    if (typeof honeypotWebsite === "string" && honeypotWebsite.trim() !== "") {
      logger.debug("Contact honeypot filled; ignoring");
      return NextResponse.json({ success: true });
    }

    const ip = getClientIpFromHeaders(req.headers);
    if (!checkContactRateLimit(ip).ok) {
      return NextResponse.json(
        {
          error:
            "Too many messages from this network. Please try again in a few minutes.",
        },
        { status: 429 },
      );
    }

    const nameStr = typeof name === "string" ? name.trim() : "";
    const emailStr = typeof email === "string" ? email.trim() : "";
    const messageStr = typeof message === "string" ? message.trim() : "";
    const phoneStr =
      typeof phone === "string" && phone.trim() !== "" ? phone.trim() : null;

    if (!nameStr || !emailStr || !messageStr) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: nameStr,
        email: emailStr,
        phone: phoneStr,
        message: messageStr,
      },
    });

    const notifyTo = getBusinessNotifyEmail();
    // From must match OAuth SMTP user (GMAIL_USER); a different CONTACT_NOTIFY_EMAIL would cause 535
    const fromAddr = getGmailSmtpUser();

    try {
      const transporter = await createGmailTransporter();
      const subject = `Contact form: ${nameStr}`;
      const html = `
        <p><strong>New message</strong> from the website contact form.</p>
        <table style="border-collapse:collapse;max-width:560px">
          <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Name</td><td>${escapeHtml(nameStr)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Email</td><td><a href="mailto:${escapeHtml(emailStr)}">${escapeHtml(emailStr)}</a></td></tr>
          ${phoneStr ? `<tr><td style="padding:6px 12px 6px 0;font-weight:600;">Phone</td><td>${escapeHtml(phoneStr)}</td></tr>` : ""}
        </table>
        <p style="margin-top:16px;font-weight:600;">Message</p>
        <p style="white-space:pre-wrap;border:1px solid #e5e7eb;padding:12px;border-radius:8px">${escapeHtml(messageStr)}</p>
        <p style="color:#6b7280;font-size:12px;margin-top:16px;">Inquiry id: ${escapeHtml(inquiry.id)}</p>
      `;

      await transporter.sendMail({
        from: `Serene Spaces <${fromAddr}>`,
        to: notifyTo,
        replyTo: emailStr,
        subject,
        html,
        text: `Name: ${nameStr}\nEmail: ${emailStr}\nPhone: ${phoneStr ?? ""}\n\n${messageStr}\n\nId: ${inquiry.id}`,
      });

      await transporter.sendMail({
        from: `Serene Spaces <${fromAddr}>`,
        to: emailStr,
        subject: "We received your message — Serene Spaces",
        html: `<p>Hi ${escapeHtml(nameStr.split(" ")[0] ?? nameStr)},</p>
          <p>Thanks for contacting Serene Spaces. We've received your message and will get back to you soon.</p>
          <p style="color:#6b7280;font-size:14px;">— Serene Spaces<br/>${escapeHtml(notifyTo)}</p>`,
        text: `Hi ${nameStr},\n\nThanks for contacting Serene Spaces. We've received your message and will get back to you soon.\n\n— Serene Spaces`,
      });
    } catch (emailErr) {
      logGmailEmailFailure("Contact form email", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you — your message was received.",
    });
  } catch (err) {
    logger.errorFrom("POST /api/contact", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again or email us directly." },
      { status: 500 },
    );
  }
}

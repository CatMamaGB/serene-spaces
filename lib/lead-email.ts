import {
  logGmailApiFailure,
  sendGmailApiMessage,
} from "@/lib/gmail-api-send";
import {
  getGmailOAuth2Client,
  getGmailSmtpUser,
  isGmailInvalidGrantError,
} from "@/lib/gmail-oauth";

export type LeadEmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendLeadEmailBatch({
  messages,
  failureContext,
}: {
  messages: LeadEmailMessage[];
  failureContext: string;
}) {
  try {
    const oauth2Client = await getGmailOAuth2Client();
    const fromEmail = getGmailSmtpUser();

    for (const message of messages) {
      await sendGmailApiMessage(oauth2Client, {
        fromDisplay: "Serene Spaces",
        fromEmail,
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
      });
    }
  } catch (emailError) {
    if (!isGmailInvalidGrantError(emailError)) {
      logGmailApiFailure(failureContext, emailError);
    }
  }
}

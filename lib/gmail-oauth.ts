import { google } from "googleapis";
import nodemailer from "nodemailer";

// Create OAuth2 client
const createOAuth2Client = () => {
  const redirectUri =
    process.env.GMAIL_REDIRECT_URI ||
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
export const createGmailTransporter = async () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth2 credentials not configured");
  }

  // Prefer loading refresh token from DB/secret store in prod
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error(
      "Gmail refresh token not configured. Complete OAuth2 setup first.",
    );
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  // Get a short-lived access token from Google (Nodemailer will not refresh by itself)
  const { token: accessToken } = await oauth2Client.getAccessToken();
  if (!accessToken) throw new Error("Failed to get access token");

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER || "loveserenespaces@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken, // include so first send succeeds immediately
    },
  });
};

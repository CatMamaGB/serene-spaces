import { google } from "googleapis";
import nodemailer from "nodemailer";

// Gmail OAuth2 configuration
const SCOPES = ["https://mail.google.com/"]; // Changed from gmail.send to enable SMTP

// Create OAuth2 client
const createOAuth2Client = () => {
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    (process.env.NODE_ENV === "production"
      ? "https://www.loveserenespaces.com/api/auth/callback/google"
      : "http://localhost:3000/api/auth/callback/google");

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

// Generate OAuth2 authorization URL
export const getAuthUrl = () => {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES, // https://mail.google.com/ - enables both Gmail API and SMTP
    prompt: "consent", // Force consent to get refresh token
  });
};

// Exchange authorization code for tokens
export const exchangeCodeForTokens = async (code: string) => {
  const oauth2Client = createOAuth2Client();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    throw error;
  }
};

// Test Gmail connection
export const testGmailConnection = async () => {
  try {
    const transporter = await createGmailTransporter();

    // Verify connection
    await transporter.verify();

    return {
      success: true,
      message: "Gmail OAuth2 connection successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gmail OAuth2 connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

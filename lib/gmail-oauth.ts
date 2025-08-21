import { google } from "googleapis";
import nodemailer from "nodemailer";

// Gmail OAuth2 configuration
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
];

// Create OAuth2 client
const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/api/auth/callback/google",
  );
};

// Create Gmail transporter using OAuth2
export const createGmailTransporter = async () => {
  try {
    // Check if we have OAuth2 credentials
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error("Google OAuth2 credentials not configured");
    }

    // Check if we have a refresh token
    if (!process.env.GMAIL_REFRESH_TOKEN) {
      throw new Error(
        "Gmail refresh token not configured. Please complete OAuth2 setup first.",
      );
    }

    const oauth2Client = createOAuth2Client();

    // Set credentials using refresh token
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    // Get access token
    const { token: accessToken } = await oauth2Client.getAccessToken();

    if (!accessToken) {
      throw new Error("Failed to get access token");
    }

    // Create transporter with OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER || "loveserenespaces@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating Gmail transporter:", error);
    throw error;
  }
};

// Generate OAuth2 authorization URL
export const getAuthUrl = () => {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
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

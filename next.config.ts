import type { NextConfig } from "next";

// Load environment variables
require("dotenv").config({ path: ".env.local" });

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
};

export default nextConfig;

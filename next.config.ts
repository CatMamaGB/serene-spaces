import type { NextConfig } from "next";

// Load environment variables
require("dotenv").config();

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["@prisma/client", "stripe", "googleapis"],
  },
  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  // Compression
  compress: true,
  // Static optimization
  trailingSlash: false,
  poweredByHeader: false,
  // Prisma optimization for Vercel serverless
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize Prisma client for serverless
      config.externals.push("@prisma/client");

      // Add fallbacks for Node.js modules
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);

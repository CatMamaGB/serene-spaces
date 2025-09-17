import type { NextConfig } from "next";

// Load environment variables
require("dotenv").config();

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
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
  // Prisma optimization for Vercel
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Prisma client is properly bundled
      config.externals = config.externals.filter(
        (external: any) => external !== '@prisma/client'
      );
      
      // Add Prisma engine files to the bundle
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);

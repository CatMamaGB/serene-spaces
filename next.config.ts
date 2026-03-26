import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: { formats: ["image/webp", "image/avif"], minimumCacheTTL: 60 },
  compress: true,
  trailingSlash: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // No env here; use process.env.* in server files. For client, use NEXT_PUBLIC_*.
  // No experimental optimizePackageImports for server-only libs.
  // No webpack externals/fallbacks for Prisma.
};

export default withBundleAnalyzer(nextConfig);

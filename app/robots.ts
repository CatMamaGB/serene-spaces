import { MetadataRoute } from "next";
import { getCanonicalOrigin } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = getCanonicalOrigin();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}

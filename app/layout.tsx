import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalyticsLazy from "../components/GoogleAnalyticsLazy";
import TrackPageViews from "../components/TrackPageViews";
import { NextAuthProvider } from "../components/NextAuthProvider";
import { ToastProvider } from "../components/ToastProvider";
import {
  absoluteUrl,
  getBusinessJsonLdId,
  getCanonicalOrigin,
} from "../lib/site";

/** GA4 — override with NEXT_PUBLIC_GA_MEASUREMENT_ID in env (e.g. staging). */
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-519B7JR17N";

// Preload primary Latin subset for faster hero text paint (LCP); adjustFontFallback limits CLS.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Serene Spaces - Professional Horse Equipment Care",
    template: "%s | Serene Spaces",
  },
  description:
    "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available. Expert care for turnout blankets, sheets, saddle pads, and more.",
  keywords: [
    "horse blanket cleaning",
    "horse equipment repair",
    "blanket waterproofing",
    "turnout blanket cleaning",
    "saddle pad cleaning",
    "horse gear repair",
    "Crystal Lake IL",
    "Chicago area horse services",
    "professional horse care",
    "equipment maintenance",
  ],
  authors: [{ name: "Serene Spaces" }],
  creator: "Serene Spaces",
  publisher: "Serene Spaces",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getCanonicalOrigin()),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Serene Spaces",
    title: "Serene Spaces - Professional Horse Equipment Care",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Horse blanket cleaning and repair — Serene Spaces, Crystal Lake IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serene Spaces - Professional Horse Equipment Care",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon1.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": getBusinessJsonLdId(),
    name: "Serene Spaces",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
    url: getCanonicalOrigin(),
    telephone: "+1-815-621-3509",
    email: "loveserenespaces@gmail.com",
    image: absoluteUrl("/og-image.jpg"),
    logo: absoluteUrl("/icon1.png"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Crystal Lake",
      addressRegion: "IL",
      postalCode: "60014",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "42.2411",
      longitude: "-88.3162",
    },
    openingHours: "Mo-Fr 09:00-17:00",
    areaServed: [
      { "@type": "City", name: "Crystal Lake", addressRegion: "IL" },
      { "@type": "City", name: "Cary", addressRegion: "IL" },
      { "@type": "City", name: "McHenry", addressRegion: "IL" },
      { "@type": "City", name: "Algonquin", addressRegion: "IL" },
      { "@type": "City", name: "Lake in the Hills", addressRegion: "IL" },
      { "@type": "City", name: "Woodstock", addressRegion: "IL" },
      { "@type": "City", name: "Huntley", addressRegion: "IL" },
      { "@type": "City", name: "Barrington", addressRegion: "IL" },
      { "@type": "City", name: "Lake Zurich", addressRegion: "IL" },
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "42.2411",
        longitude: "-88.3162",
      },
      geoRadius: "40000",
    },
    services: [
      {
        "@type": "Service",
        name: "Horse Blanket Cleaning",
        description:
          "Professional cleaning for turnout blankets, sheets, and saddle pads",
      },
      {
        "@type": "Service",
        name: "Equipment Repair",
        description:
          "Rip repairs, strap replacement, and other equipment repairs",
      },
      {
        "@type": "Service",
        name: "Waterproofing",
        description: "Professional waterproofing treatment with DWR coating",
      },
      {
        "@type": "Service",
        name: "Barn Organization",
        description: "Professional barn organization and equipment management",
      },
    ],
    priceRange: "$5-$25",
    paymentAccepted: "Cash, Zelle, Venmo",
    currenciesAccepted: "USD",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <NextAuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </NextAuthProvider>
        <GoogleAnalyticsLazy gaId={GA_MEASUREMENT_ID} />
        <Suspense fallback={null}>
          <TrackPageViews />
        </Suspense>
      </body>
    </html>
  );
}

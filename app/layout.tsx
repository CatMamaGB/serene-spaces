import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import { ToastProvider } from "../components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

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
  metadataBase: new URL("https://loveserenespaces.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://loveserenespaces.com",
    siteName: "Serene Spaces",
    title: "Serene Spaces - Professional Horse Equipment Care",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
    images: [
      {
        url: "/white background Barn Organization Specialists.png",
        width: 1200,
        height: 630,
        alt: "Serene Spaces - Professional Horse Equipment Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serene Spaces - Professional Horse Equipment Care",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL.",
    images: ["/white background Barn Organization Specialists.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Serene Spaces",
    description:
      "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
    url: "https://loveserenespaces.com",
    telephone: "+1-815-621-3509", // Replace with actual phone number
    email: "loveserenespaces@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Crystal Lake",
      addressRegion: "IL",
      postalCode: "60014",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "42.2411", // Replace with actual coordinates
      longitude: "-88.3162",
    },
    openingHours: "Mo-Fr 09:00-17:00",
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "42.2411",
        longitude: "-88.3162",
      },
      geoRadius: "50000",
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
      </body>
    </html>
  );
}

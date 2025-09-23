import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "../components/NextAuthProvider";
import { ToastProvider } from "../components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serene Spaces - Professional Horse Equipment Care",
  description:
    "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
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
  return (
    <html lang="en">
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

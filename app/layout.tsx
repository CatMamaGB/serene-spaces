import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serene Spaces - Professional Horse Equipment Care",
  description: "Professional horse blanket cleaning, repairs, and waterproofing services in Crystal Lake, IL. Local pickup and delivery available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}

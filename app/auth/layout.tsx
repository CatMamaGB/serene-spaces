import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextAuthProvider } from "../../components/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serene Spaces - Admin Login",
  description: "Sign in to access the Serene Spaces admin portal",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

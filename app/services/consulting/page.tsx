import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Strategy Consulting Service - Serene Spaces",
  description:
    "Professional horse strategy consulting and advisory services. Expert guidance for horse care, equipment management, and facility optimization in Crystal Lake, IL area.",
  keywords: [
    "horse strategy consulting",
    "horse care consulting",
    "equipment management advice",
    "horse facility consulting",
    "equine advisory services",
    "Crystal Lake horse consulting",
    "professional horse guidance",
  ],
  openGraph: {
    title: "Horse Strategy Consulting Service - Serene Spaces",
    description:
      "Professional horse strategy consulting and advisory services. Expert guidance for horse care and equipment management.",
    url: "https://loveserenespaces.com/services/consulting",
  },
  twitter: {
    title: "Horse Strategy Consulting Service - Serene Spaces",
    description:
      "Professional horse strategy consulting and advisory services.",
  },
};

export default function ConsultingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "48px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e9ecef",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "24px",
            opacity: "0.3",
          }}
        >
          🚧
        </div>

        <h1
          style={{
            fontSize: "2rem",
            margin: "0 0 16px 0",
            color: "#1a1a1a",
            fontWeight: "700",
          }}
        >
          Consulting & Horse Strategy Service
        </h1>

        <p
          style={{
            color: "#666",
            margin: "0 0 32px 0",
            fontSize: "1.1rem",
            lineHeight: "1.6",
          }}
        >
          This service is currently being updated. Please check back soon for
          more information.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            backgroundColor: "#7a6990",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

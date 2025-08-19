"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        padding: isMobile ? "50px 20px" : "80px 24px",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 80%, rgba(122, 105, 144, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(122, 105, 144, 0.04) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
            gap: isMobile ? "50px" : "60px",
            marginBottom: "60px",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {/* Company Info - Takes up more space */}
          <div>
            <div
              style={{
                fontSize: isMobile ? "1.75rem" : "2.25rem",
                fontWeight: "700",
                marginBottom: "20px",
                background: "linear-gradient(135deg, #7a6990 0%, #9f8bb3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Serene Spaces
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                margin: "0 0 25px 0",
                lineHeight: "1.7",
                fontSize: isMobile ? "1rem" : "1.1rem",
                maxWidth: "400px",
              }}
            >
              Professional horse blanket cleaning, repairs, and waterproofing
              services. Serving the equestrian community with expertise and care
              for over 10 years.
            </p>

            {/* Social Media Section */}
            <div>
              <h4
                style={{
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  marginBottom: "16px",
                  fontWeight: "600",
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Follow Us
              </h4>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <a
                  href="https://instagram.com/loveserenespaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "1.3rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E4405F";
                    e.currentTarget.style.backgroundColor =
                      "rgba(228, 64, 95, 0.15)";
                    e.currentTarget.style.borderColor = "#E4405F";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(228, 64, 95, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  title="Follow us on Instagram @loveserenespaces"
                >
                  📷
                </a>
                <a
                  href="https://facebook.com/loveserenespaces"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "1.3rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#1877F2";
                    e.currentTarget.style.backgroundColor =
                      "rgba(24, 119, 242, 0.15)";
                    e.currentTarget.style.borderColor = "#1877F2";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(24, 119, 242, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  title="Follow us on Facebook"
                >
                  📘
                </a>
                <a
                  href="mailto:loveserenespaces@gmail.com"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "1.3rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#EA4335";
                    e.currentTarget.style.backgroundColor =
                      "rgba(234, 67, 53, 0.15)";
                    e.currentTarget.style.borderColor = "#EA4335";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(234, 67, 53, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  title="Email us at loveserenespaces@gmail.com"
                >
                  ✉️
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: isMobile ? "1.1rem" : "1.2rem",
                marginBottom: "24px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.95)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Quick Links
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {[
                { href: "/", label: "Home" },
                { href: "/pricing", label: "Pricing" },
                { href: "/intake", label: "Schedule Service" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    fontSize: "1rem",
                    fontWeight: "500",
                    position: "relative",
                    padding: "6px 0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4
              style={{
                fontSize: isMobile ? "1.1rem" : "1.2rem",
                marginBottom: "24px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.95)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Contact
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  📧
                </div>
                <a
                  href="mailto:loveserenespaces@gmail.com"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  loveserenespaces@gmail.com
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  justifyContent: isMobile ? "center" : "flex-start",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                  }}
                >
                  📞
                </div>
                <a
                  href="tel:+18156213509"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  (815) 621-3509
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: isMobile ? "20px" : "0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: isMobile ? "center" : "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0",
                  fontWeight: "500",
                }}
              >
                © 2025 Serene Spaces. All rights reserved.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.6)",
                  margin: "0",
                }}
              >
                Professional horse equipment care services
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <span>Made with ❤️ by</span>
              <a
                href="https://codeandcosmos.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }}
              >
                Code & Cosmos
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

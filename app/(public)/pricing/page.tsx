import Footer from "../../../components/Footer";
import SEOStructuredData from "../../../components/SEOStructuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Pricing - Serene Spaces Horse Equipment Care",
  description:
    "Transparent pricing for professional horse blanket cleaning, repairs, and waterproofing services. Turnout blankets $25, sheets $20, waterproofing $20. Serving Crystal Lake, IL area.",
  keywords: [
    "horse blanket cleaning prices",
    "equipment repair pricing",
    "blanket waterproofing cost",
    "turnout blanket cleaning price",
    "saddle pad cleaning cost",
    "horse gear repair rates",
    "Crystal Lake pricing",
    "transparent service costs",
  ],
  openGraph: {
    title: "Service Pricing - Serene Spaces Horse Equipment Care",
    description:
      "Transparent pricing for professional horse blanket cleaning, repairs, and waterproofing services. Serving Crystal Lake, IL area.",
    url: "https://loveserenespaces.com/pricing",
  },
  twitter: {
    title: "Service Pricing - Serene Spaces Horse Equipment Care",
    description:
      "Transparent pricing for professional horse blanket cleaning, repairs, and waterproofing services.",
  },
};

export default function PricingPage() {
  return (
    <>
      <SEOStructuredData
        type="Service"
        name="Horse Equipment Cleaning Services"
        description="Professional horse blanket cleaning, repairs, and waterproofing services with transparent pricing"
        url="https://loveserenespaces.com/pricing"
        serviceType="Horse Equipment Care"
      />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Hero Section */}
        <section
          style={{
            background: "linear-gradient(135deg, #2e2434 0%, #5f4b6a 100%)",
            color: "white",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                marginBottom: "24px",
                fontWeight: "700",
              }}
            >
              Service Pricing
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                opacity: "0.9",
                lineHeight: "1.6",
              }}
            >
              Clear, transparent pricing for professional horse equipment care
            </p>
          </div>
        </section>

        {/* Standard Service Pricing */}
        <section
          style={{
            padding: "80px 24px",
            backgroundColor: "white",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "1px solid #e9ecef",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#7a6990",
                  color: "white",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{ fontSize: "1.5rem", margin: "0", fontWeight: "600" }}
                >
                  Cleaning Services
                </h3>
              </div>

              <div style={{ padding: "32px" }}>
                <div
                  style={{
                    display: "grid",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Turnout Blanket
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#7a6990",
                      }}
                    >
                      $25
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Blanket (with fill)
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#7a6990",
                      }}
                    >
                      $25
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Sheet/Fly Sheet (no fill)
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#7f86ac",
                      }}
                    >
                      $20
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Hood or Neck Cover
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#9ab5d9",
                      }}
                    >
                      $15
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Saddle Pad
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#5f4b6a",
                      }}
                    >
                      $10
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Wraps / Boots (each)
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#7a6990",
                      }}
                    >
                      $5
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Fleece Girth
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#7f86ac",
                      }}
                    >
                      $15
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Tail Strap
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#9ab5d9",
                      }}
                    >
                      $10
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 0",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                        color: "#333",
                        fontWeight: "500",
                      }}
                    >
                      Leg Strap
                    </span>
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#5f4b6a",
                      }}
                    >
                      $15
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section
          style={{
            padding: "80px 24px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                textAlign: "center",
                marginBottom: "60px",
                color: "#1a1a1a",
              }}
            >
              Additional Services
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px 30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "1px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: "16px",
                    color: "#7a6990",
                    fontWeight: "600",
                  }}
                >
                  Waterproofing
                </h3>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#7a6990",
                    marginBottom: "16px",
                  }}
                >
                  $20
                </div>
                <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                  Professional waterproofing treatment with DWR coating and seam
                  sealing
                </p>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "40px 30px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "1px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: "16px",
                    color: "#7a6990",
                    fontWeight: "600",
                  }}
                >
                  Repairs
                </h3>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "#7a6990",
                    marginBottom: "16px",
                  }}
                >
                  Starting at $15
                </div>
                <p style={{ color: "#666", lineHeight: "1.6", margin: "0" }}>
                  Rip repairs, strap replacement, and other repairs as needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            padding: "80px 24px",
            backgroundColor: "#7a6990",
            color: "white",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "24px",
              }}
            >
              Ready to Schedule Your Service?
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                marginBottom: "32px",
                opacity: "0.9",
              }}
            >
              Get started with professional horse equipment care today
            </p>
            <a
              href="/intake"
              style={{
                display: "inline-block",
                backgroundColor: "white",
                color: "#7a6990",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textDecoration: "none",
                transition: "transform 0.2s",
              }}
            >
              Schedule Service
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

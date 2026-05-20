import Footer from "../../../components/Footer";
import SEOStructuredData from "../../../components/SEOStructuredData";
import type { Metadata } from "next";
import { PRICING, PRICE_LABELS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Pricing | Serene Spaces",
  description:
    "View pricing for horse blanket cleaning, waterproofing, and repairs in Crystal Lake and surrounding areas. Pickup and delivery available.",
  alternates: {
    canonical: "/pricing",
  },
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
    title: "Horse Blanket Cleaning Pricing | Serene Spaces",
    description:
      "View pricing for horse blanket cleaning, waterproofing, and repairs in Crystal Lake and surrounding areas. Pickup and delivery available.",
    url: "/pricing",
  },
  twitter: {
    title: "Horse Blanket Cleaning Pricing | Serene Spaces",
    description:
      "View pricing for horse blanket cleaning, waterproofing, and repairs in Crystal Lake and surrounding areas.",
  },
};

const cleaningServices = [
  { code: "BLANKET_FILL", accent: "text-primary" },
  { code: "SHEET_NO_FILL", accent: "text-[#7f86ac]" },
  { code: "SADDLE_PAD", accent: "text-[#5f4b6a]" },
  { code: "WRAPS", accent: "text-[#7a6990]" },
  { code: "BOOTS", accent: "text-[#9ab5d9]" },
  { code: "HOOD_NECK", accent: "text-primary" },
  { code: "FLEECE_GIRTH", accent: "text-[#7f86ac]" },
  { code: "LEG_STRAPS", accent: "text-[#5f4b6a]" },
] as const;

export default function PricingPage() {
  return (
    <>
      <SEOStructuredData
        type="Service"
        name="Horse Equipment Cleaning Services"
        description="Professional horse blanket cleaning, repairs, and waterproofing services with transparent pricing"
        pathname="/pricing"
        serviceType="Horse Equipment Care"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
                Service Pricing
              </h1>
              <p className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 lg:mb-10 opacity-90 leading-relaxed">
                Clear, transparent pricing for professional horse equipment care
              </p>
            </div>
          </div>
        </section>

        {/* Standard Service Pricing */}
        <section className="padding-responsive bg-white">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-primary text-white p-6 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Cleaning Services
                  </h3>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="space-y-4 sm:space-y-6">
                    {cleaningServices.map(({ code, accent }, index) => (
                      <div
                        key={code}
                        className={`flex justify-between items-center py-4 ${
                          index < cleaningServices.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <span className="text-sm sm:text-base font-medium text-gray-900">
                          {PRICE_LABELS[code]}
                        </span>
                        <span className={`text-lg sm:text-xl font-bold ${accent}`}>
                          ${PRICING[code]}
                        </span>
                      </div>
                    ))}
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

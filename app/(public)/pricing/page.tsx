import Footer from "../../../components/Footer";
import SEOStructuredData from "../../../components/SEOStructuredData";
import Link from "next/link";
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
  { code: "WATERPROOFING", accent: "text-[#7a6990]" },
  { code: "REPAIR_REPLACE_LEG_STRAPS", accent: "text-[#9ab5d9]" },
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
        <section className="padding-responsive bg-gray-50 border-y border-gray-200">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-responsive-lg font-bold text-center mb-12 sm:mb-16 text-gray-900">
                Additional Services
              </h2>

              <div className="grid gap-6 sm:grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                    Repairs
                  </h3>
                  <div className="text-3xl font-bold text-primary mb-4">
                    Starting at $15
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Rip repairs, strap replacement, and other repairs as needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="padding-responsive bg-primary text-white text-center">
          <div className="container-responsive">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-responsive-lg font-bold mb-4 sm:mb-6">
                Ready to Schedule Your Service?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg mb-8 text-gray-100 leading-relaxed">
                Book your pickup online, or reach out if you have a custom request
                before submitting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/intake"
                  className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4"
                >
                  Book a Pickup
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 border border-white/40"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

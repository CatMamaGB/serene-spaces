import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Huntley IL | Serene Spaces",
  description:
    "Horse blanket cleaning, waterproofing, and repairs in Huntley, IL with free pickup and delivery. Reliable service for barns and horse owners.",
  alternates: {
    canonical: "/locations/huntley",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Huntley IL | Serene Spaces",
    description:
      "Horse blanket cleaning, waterproofing, and repairs in Huntley, IL with free pickup and delivery. Reliable service for barns and horse owners.",
    url: "/locations/huntley",
  },
};

export default function HuntleyLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Huntley, IL
            </h1>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Serene Spaces provides professional horse blanket cleaning,
              waterproofing, and repair services in Huntley, Illinois. With free
              pickup and delivery available, we make it easy for horse owners and
              barns to keep blankets clean, functional, and ready for every season.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Free Pickup and Delivery in Huntley
            </h2>
            <p>
              We offer convenient pickup and return services throughout Huntley and
              nearby areas. Whether you have a single blanket or multiple from a
              barn, we handle everything from cleaning to repairs so you don&apos;t
              have to.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Services We Offer
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Horse blanket washing</li>
              <li>Waterproofing treatments</li>
              <li>Blanket repairs and stitching</li>
              <li>Tack and equipment cleaning</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Local Convenience for Huntley Barns and Riders
            </h2>
            <p>
              We regularly work with horse owners and barns in Huntley, making it
              simple to coordinate pickup days and manage multiple blankets at once.
              Our service is designed to save time while ensuring your equipment is
              properly cared for.
            </p>

            <p className="text-center text-gray-800 font-medium pt-4">
              Schedule your pickup today or view pricing to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/pricing"
                className="btn-primary text-center px-8 py-3 text-sm sm:text-base"
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="btn-secondary text-center px-8 py-3 text-sm sm:text-base border border-primary text-primary"
              >
                Schedule Pickup
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

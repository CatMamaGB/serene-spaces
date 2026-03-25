import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Barrington IL | Serene Spaces",
  description:
    "Premium horse blanket cleaning, waterproofing, and repair services in Barrington, IL with pickup and delivery available.",
  alternates: {
    canonical: "/locations/barrington",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Barrington IL | Serene Spaces",
    description:
      "Premium horse blanket cleaning, waterproofing, and repair services in Barrington, IL with pickup and delivery available.",
    url: "https://loveserenespaces.com/locations/barrington",
  },
};

export default function BarringtonLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Barrington, IL
            </h1>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Serene Spaces offers high-quality horse blanket cleaning,
              waterproofing, and repair services for horse owners and barns in
              Barrington, Illinois. Our pickup and delivery service makes blanket
              care simple, reliable, and stress-free.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Pickup and Delivery in Barrington
            </h2>
            <p>
              We provide convenient pickup and return service throughout Barrington
              and surrounding areas. Whether you&apos;re managing multiple horses or
              just need seasonal cleaning, we handle the process from start to
              finish.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Services We Offer
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Professional blanket cleaning</li>
              <li>Waterproofing for weather protection</li>
              <li>Repair services for damaged blankets</li>
              <li>Equipment and tack cleaning</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Trusted by Local Horse Owners
            </h2>
            <p>
              Barrington is home to many dedicated riders and barns, and we
              understand the importance of maintaining quality equipment. Our
              service helps extend the life of your blankets while keeping them
              performing at their best.
            </p>

            <p className="text-center text-gray-800 font-medium pt-4">
              Get started today by scheduling pickup or viewing pricing.
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

import Footer from "../../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horse Blanket Cleaning Lake Zurich IL | Serene Spaces",
  description:
    "Horse blanket cleaning, repairs, and waterproofing in Lake Zurich, IL. Pickup and delivery available for horse owners and barns.",
  alternates: {
    canonical: "/locations/lake-zurich",
  },
  openGraph: {
    title: "Horse Blanket Cleaning Lake Zurich IL | Serene Spaces",
    description:
      "Horse blanket cleaning, repairs, and waterproofing in Lake Zurich, IL. Pickup and delivery available for horse owners and barns.",
    url: "/locations/lake-zurich",
  },
};

export default function LakeZurichLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Horse Blanket Cleaning in Lake Zurich, IL
            </h1>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto space-y-8 text-gray-700 text-sm sm:text-base leading-relaxed">
            <p>
              Serene Spaces provides professional horse blanket cleaning,
              waterproofing, and repair services in Lake Zurich, Illinois. With
              convenient pickup and delivery options, we help horse owners keep
              their equipment clean and ready year-round.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Convenient Pickup in Lake Zurich
            </h2>
            <p>
              We offer pickup and delivery services throughout Lake Zurich and nearby
              areas. Whether you need seasonal cleaning or ongoing support for
              multiple blankets, we make the process simple and efficient.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Services We Offer
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Blanket washing and care</li>
              <li>Waterproofing treatments</li>
              <li>Repairs and stitching</li>
              <li>Tack and equipment cleaning</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Reliable Service for Local Riders
            </h2>
            <p>
              We work with horse owners and barns in and around Lake Zurich to
              provide dependable, high-quality service. Our goal is to make blanket
              care one less thing you have to worry about.
            </p>

            <p className="text-center text-gray-800 font-medium pt-4">
              View pricing or schedule your pickup today.
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

import Footer from "../../../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Area | Horse Blanket Cleaning | Serene Spaces",
  description:
    "See where Serene Spaces offers free pickup and where travel fees apply across McHenry County and nearby suburbs.",
  alternates: {
    canonical: "/service-area",
  },
  openGraph: {
    title: "Service Area | Horse Blanket Cleaning | Serene Spaces",
    description:
      "See where Serene Spaces offers free pickup and where travel fees apply across McHenry County and nearby suburbs.",
    url: "/service-area",
  },
};

export default function ServiceAreaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-800 via-primary-dark to-primary text-white padding-responsive">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-responsive-xl font-bold mb-4 sm:mb-6 tracking-tight">
              Service Area
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed">
              Free pickup within 25 miles of Crystal Lake, plus extended coverage
              for a travel fee.
            </p>
          </div>
        </div>
      </section>

      <section className="padding-responsive bg-white">
        <div className="container-responsive max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Free Pickup Area
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
              We offer free pickup and delivery within 25 miles of Crystal Lake,
              including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 text-sm sm:text-base">
              <li>Crystal Lake</li>
              <li>Cary</li>
              <li>McHenry</li>
              <li>Lake in the Hills</li>
              <li>Algonquin</li>
              <li>Woodstock</li>
              <li>Huntley</li>
              <li>Barrington</li>
              <li>Lake Zurich</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Extended Service Area
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              We also serve the greater Northwest suburbs of Chicago outside the free
              radius for a small travel fee.{" "}
              <strong>Contact us for availability</strong> in your area.
            </p>
            <Link
              href="/contact"
              className="inline-block btn-primary px-6 py-3 text-sm sm:text-base"
            >
              Contact us
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              Service by area
            </h3>
            <p className="text-sm text-gray-600 text-center mb-3">
              Local pages with details and how to get started:
            </p>
            <p className="text-sm text-gray-600 flex flex-wrap gap-x-2 gap-y-2 justify-center items-center">
              <Link href="/locations/crystal-lake" className="text-primary font-medium hover:underline">
                Crystal Lake
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/cary" className="text-primary font-medium hover:underline">
                Cary
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/mchenry" className="text-primary font-medium hover:underline">
                McHenry
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/algonquin" className="text-primary font-medium hover:underline">
                Algonquin
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/huntley" className="text-primary font-medium hover:underline">
                Huntley
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/barrington" className="text-primary font-medium hover:underline">
                Barrington
              </Link>
              <span aria-hidden="true" className="text-gray-400">
                ·
              </span>
              <Link href="/locations/lake-zurich" className="text-primary font-medium hover:underline">
                Lake Zurich
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
